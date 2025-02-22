export {}

type NonUndef<T> = T & ({} | null)

type Paths<A, B, isPrism extends boolean> = undefined extends B
  ? {}
  : {
      [K in keyof B | KeyOfDistr<B>]: K extends keyof B
        ? undefined extends B[K]
          ? Diopter<A, NonUndef<B[K]> | undefined, isPrism>
          : Diopter<A, B[K], isPrism>
        : K extends KeyOfDistr<B>
          ? Diopter<A, AccessDistr<B, K> | undefined, isPrism>
          : never
    }

type Diopter<A, B, isPrism extends boolean = false> = {
  get(a: A): NoInfer<isPrism> extends true ? B | undefined : B
  set(a: A, modFn: (b: B) => B): A
  isPrism: isPrism
  print: () => string
} & Std<A, B, isPrism> &
  Paths<A, B, isPrism>

type Std<A, B, isAbPrism extends boolean> = {
  compose<C, isBcPrism extends boolean>(
    bc: Diopter<B, C, isBcPrism>,
  ): Diopter<
    A,
    C,
    isAbPrism extends true ? true : isBcPrism extends true ? true : false
  >

  /**
   * `opt()` is just a `guard()` with a predicate that excludes `undefined`
   */
  opt(): Diopter<A, NonUndef<B>, true>

  guard<X extends B>(
    predicate: ((b: B) => b is X) | ((b: B) => boolean),
  ): Diopter<A, X, true>

  map<C>(
    mapFn: (
      valueOfA: Diopter<ValueOf<B>, ValueOf<B>>,
    ) => Diopter<ValueOf<B>, C>,
  ): Diopter<A, NonNullable<C>[]>

  find<C extends B>(predicate: (b: B) => b is C): Diopter<A[], C[]>

  flatOnce(): Diopter<A, B extends any[][] ? B[number] : never>
}

const std = <A, B, isAbPrism extends boolean>(ab: Diopter<A, B, isAbPrism>) => {
  const compose: Std<A, B, isAbPrism>['compose'] = (bc) =>
    composeDiopters(ab, bc)

  const opt: Std<A, B, isAbPrism>['opt'] = () => guard((a) => a !== undefined)

  const guard: Std<A, B, isAbPrism>['guard'] = (predicate) =>
    compose(
      diopter({
        get: (a) => {
          return predicate(a) ? a : undefined
        },
        set: ((a, modFn) => {
          return predicate(a) ? modFn(a as any) : a
        }) as any,
        isPrism: true,
      }),
    ) as any

  const map: Std<A, B, isAbPrism>['map'] = (mapFn) => {
    const get = ((a) => {
      if (!Array.isArray(a)) {
        throw new Error('Not an array')
      }
      return a
        .map((elem, i) => {
          const elemLens = id<typeof elem>()
          const transformedLens = mapFn(elemLens as any)
          const transformed = transformedLens.get(elem)
          return transformed
        })
        .filter(
          (x): x is NonNullable<typeof x> => x !== undefined && x !== null,
        )
    }) as any

    return compose(
      diopter({
        get,
        set: ((a, modFn) => {
          if (!Array.isArray(a)) {
            throw new Error('Not an array')
          }
          const valuesWithUndefs = a.map((elem, i) => {
            const elemLens = id<typeof elem>()
            const transformedLens = mapFn(elemLens as any)
            const transformed = transformedLens.get(elem)
            return transformed
          })

          const definedIndices = valuesWithUndefs
            .map((x, i) => (x !== undefined ? i : null))
            .filter((x) => x !== null)

          const values = valuesWithUndefs.filter(
            (x): x is NonNullable<typeof x> => x !== undefined && x !== null,
          )

          const modified = modFn(values)

          if (!Array.isArray(modified)) {
            throw new Error('Modified is not an array')
          }
          if (modified.length !== definedIndices.length) {
            throw new Error('Array length mismatch')
          }

          return a
            .filter((_, i) => definedIndices.includes(i))
            .map((elem, i) => {
              const elemLens = id<typeof elem>()
              const transformedLens = mapFn(elemLens as any)
              const transformed = transformedLens.set(elem, () => modified[i])
              return transformed
            })
        }) as any,
        debug: `map(${mapFn.toString()})`,
      }),
    ) as any
  }

  const flatOnce: Std<A, B, isAbPrism>['flatOnce'] = () => {
    return compose(
      diopter({
        get: (a) => {
          const arr = ab.get(a)
          if (!Array.isArray(arr)) throw new Error('Not an array')
          return arr.reduce((acc, row) => {
            if (!Array.isArray(row)) throw new Error('Not a 2d array')
            return acc.concat(row)
          }, [])
        },
        set: ((a, modFn) => {
          const arr = ab.get(a)
          if (!Array.isArray(arr)) throw new Error('Not an array')
          const flat = arr.reduce((acc, row) => {
            if (!Array.isArray(row)) throw new Error('Not a 2d array')
            return acc.concat(row)
          }, [])
          const modded = modFn(flat)
          if (modded.length !== flat.length)
            throw new Error('Modified array length mismatch')
          let index = 0
          const new2d = arr.map((row) => {
            const len = row.length
            const newRow = modded.slice(index, index + len)
            index += len
            return newRow
          })
          return ab.set(a, () => new2d as any)
        }) as any,
        debug: 'flatOnce',
      }),
    ) as any
  }

  const target = {
    ...ab,
    compose,
    opt,
    guard,
    map,
    flatOnce,
  }

  return new Proxy(target, {
    get(target, prop) {
      if (prop in target) {
        return target[prop as any]
      }

      return compose(
        diopter({
          get: (a) => {
            return a[prop as any]
          },
          set: (a, modFn) => {
            return { ...a, [prop]: modFn(a[prop]) }
          },
          debug: prop as string,
        }),
      )
    },
  })
}

const diopter = <A, B, isPrism extends boolean = false>({
  get,
  set,
  isPrism,
  debug,
}: {
  get: (a: A) => B
  set: (a: A, modFn: (b: B) => B) => A
  isPrism?: isPrism
  debug?: string
  // debug?: {
  //   name: string
  //   tail: Diopter<any, any, any>[]
  //   head: Diopter<any, any, any>
  // }
}): Diopter<A, B, isPrism> => {
  const thisLens = {
    get,
    set,
    isPrism: isPrism ?? false,
    print: () => {
      return debug ?? 'no debug'
    },
  }

  return std(thisLens as any)
}

const composeDiopters = <
  A,
  B,
  C,
  isAbPrism extends boolean,
  isBcPrism extends boolean,
>(
  ab: Diopter<A, B, isAbPrism>,
  bc: Diopter<B, C, isBcPrism>,
): Diopter<
  A,
  C,
  isAbPrism extends true ? true : isBcPrism extends true ? true : false
> => {
  return diopter({
    get: ((a) => {
      const b = ab.get(a)
      if (ab.isPrism && b === undefined) {
        return undefined
      }
      return bc.get(b as any)
    }) as any,
    set: ((a, modFn) => {
      const b = ab.get(a)
      if (ab.isPrism && b === undefined) {
        return a
      }
      return ab.set(a, () => bc.set(b as any, modFn) as B)
    }) as any,
    isPrism: ab.isPrism || bc.isPrism,
    debug: `[${ab.print()}] + [${bc.print()}]`,
  }) as any
}

const id = <A>(): Diopter<A, A> =>
  diopter({
    get: (a: A) => a,
    set: (a, modFn) => modFn(a),
    debug: 'id',
  })

type KeyOfDistr<T> = T extends any ? keyof T : never
type AccessDistr<T, K extends KeyOfDistr<T>> =
  T extends Record<K, any> ? T[K] : never

type ValueOf<T> = T extends any[]
  ? T[number]
  : T extends Record<any, any>
    ? T[keyof T]
    : never

export const d = id
