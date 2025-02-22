export {}

type Dioptre<A, B> = {
  get(a: A): B
  set(a: A, mod: (b: Values<B>) => Values<B>): A
} & Std<A, B> & {
    [K in keyof B | KeyOfDistr<B>]: K extends keyof B
      ? undefined extends B[K]
        ? Dioptre<A, NonNullable<B[K]> | undefined>
        : Dioptre<A, B[K]>
      : K extends KeyOfDistr<B>
        ? Dioptre<A, AccessDistr<B, K> | undefined>
        : never
  }

type Std<A, B> = {
  compose<C>(
    bc: Dioptre<B, C>,
  ): Dioptre<A, HasUndefined<B> extends true ? C | undefined : C>

  // path<K extends keyof B | KeyOfDistr<B>>(
  //   key: K,
  // ): K extends keyof B
  //   ? undefined extends B[K]
  //     ? Dioptre<A, NonNullable<B[K]> | undefined>
  //     : Dioptre<A, B[K]>
  //   : K extends KeyOfDistr<B>
  //     ? Dioptre<A, AccessDistr<B, K> | undefined>
  //     : never

  map<C>(
    mapFn: (valueOfA: Dioptre<Values<B>, Values<B>>) => Dioptre<Values<B>, C>,
  ): Dioptre<A, NonNullable<C>[]>

  find<C extends B>(predicate: (b: B) => b is C): Dioptre<A[], C[]>
}

const std = <A, B>(ab: Dioptre<A, B>) => {
  const compose: Std<A, B>['compose'] = (bc) => composeLens(ab, bc)

  const path: Std<A, B>['path'] = (key) =>
    dioptre({
      get: (a: {}) => {
        if (typeof a === 'object' && key in a) {
          return a[key as any]
        }
        return undefined
      },
    }) as any

  const map: Std<A, B>['map'] = (mapFn) =>
    dioptre({
      get: ((a: A) => {
        if (!Array.isArray(a)) {
          throw new Error('Not an array')
        }
        return (
          a
            .map((elem, i) => {
              const elemLens = dioptre({
                get: (_a: A) => (_a as unknown as any[])[i] as Values<A>,
              })
              const transformedLens = mapFn(elemLens as any)
              const transformed = transformedLens.get(a as any)

              return transformed
            })
            // todo: maybe it's fine to return undefs/nulls from traversals?
            .filter(
              (x): x is NonNullable<typeof x> => x !== undefined && x !== null,
            )
        )
      }) as any,
    })

  const find = (predicate: (b) => boolean) =>
    map((x) =>
      x.compose(
        dioptre({
          get: (a) => {
            if (predicate(a)) {
              return a
            }
            return null!
          },
        }),
      ),
    )

  return { compose, path, map }
}

const dioptre = <A, B>({ get }: { get: (a: A) => B }): Dioptre<A, B> => {
  const thisLens = {
    get,
  }
  Object.assign(thisLens, std(thisLens as any))

  return thisLens as any
}

type HasUndefined<T> = undefined extends T ? true : false

const composeLens = <A, B, C>(
  ab: Dioptre<A, B>,
  bc: Dioptre<NonNullable<B>, C>,
): Dioptre<A, HasUndefined<B> extends true ? C | undefined : C> => {
  return dioptre({
    get: ((a) => {
      const b = ab.get(a)
      if (b === undefined) {
        return undefined
      }
      return bc.get(b as any)
    }) as any,
  })
}

const id = <A>(): Dioptre<A, A> =>
  dioptre({
    get: (a: A) => a,
  })

type KeyOfDistr<T> = T extends any ? keyof T : never
type AccessDistr<T, K extends KeyOfDistr<T>> =
  T extends Record<K, any> ? T[K] : never

type Values<T> = T extends any[]
  ? T[number]
  : T extends Record<any, any>
    ? T[keyof T]
    : never

const testLens = id<{ addresses: { street?: { name: string } }[] }>()
  ._(path('addresses'))
  ._(map((_) => _(path('street'))._(path('name'))))

type Person = {
  addresses: Address[]
  testing?: { deep: string }
} & ({ test: { deep: { stuff: 'foo' } } } | {})
type Street = { num: number; name: string }
type Address = { city: string; street: Street }

const test = id<Person>()._(path('test'))._(path('deep'))._(path('stuff'))

const d = id

d<Person>()
  .path('addresses')
  .map((x) => x.path('street'))
  .get()

d<{ a: { b: { c: 123 }[] }[] }>()
  .path('a')
  .map((x) => x.path('b').map((x) => x.path('c')))
  .get()



  const data = null!




  

const value = d<{ a: {b?: {c: 123}} }>().a.b.c.get(data)
















console.log(value)