export {}

type Lens<A, B> = {
  get(a: A): B
  _<C>(
    bc: Lens<B, C>,
  ): Lens<A, HasUndefined<B> extends true ? C | undefined : C>
}

const lens = <A, B>({ get }: { get: (a: A) => B }): Lens<A, B> => {
  const thisLens = {
    get,
    _: <C>(bc: Lens<B, C>) => compose(thisLens, bc),
  } satisfies Lens<A, B>
  return thisLens
}

type HasUndefined<T> = undefined extends T ? true : false

const compose = <A, B, C>(
  ab: Lens<A, B>,
  bc: Lens<NonNullable<B>, C>,
): Lens<A, HasUndefined<B> extends true ? C | undefined : C> => {
  return lens({
    get: ((a) => {
      const b = ab.get(a)
      if (b === undefined) {
        return undefined
      }
      return bc.get(b as any)
    }) as any,
  })
}

const _ = <A>(): Lens<A, A> =>
  lens({
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

// maybe can be simplified to just use KeyOfDistr only?
const path = <T, K extends keyof T | KeyOfDistr<T>>(
  key: K,
): K extends keyof T
  ? undefined extends T[K]
    ? Lens<T, NonNullable<T[K]> | undefined>
    : Lens<T, T[K]>
  : K extends KeyOfDistr<T>
    ? Lens<T, AccessDistr<T, K> | undefined>
    : never =>
  ({
    get: (obj: T) => null!,
  }) as any

// const required = <T>(): Lens<T, NonNullable<T>> => ({
//   get: (a) => {
//     if (a === undefined || a === null) {
//       throw new Error('Undefined')
//     }
//     return a
//   },
//   type: 'lens',
// })

const map = <A, B>(
  mapFn: (valuesOfA: Lens<A, Values<A>>['_']) => Lens<A, B>,
): Lens<A, NonNullable<B>[]> =>
  lens({
    get: ((a: A) => {
      if (!Array.isArray(a)) {
        throw new Error('Not an array')
      }
      return (
        a
          .map((elem, i) => {
            const elemLens: Lens<A, Values<A>> = lens({
              get: (_a: A) => (_a as unknown as any[])[i] as Values<A>,
            })
            const transformedLens = mapFn(elemLens._)
            const transformed = transformedLens.get(a)

            return transformed
          })
          // todo: maybe it's fine to return undefs/nulls from traversals?
          .filter(
            (x): x is NonNullable<typeof x> => x !== undefined && x !== null,
          )
      )
    }) as any,
  })

const find = <A, B extends A>(predicate: (a: A) => a is B): Lens<A[], B[]> =>
  map((_) =>
    _(
      lens({
        get: (a) => {
          if (predicate(a)) {
            return a
          }
          return null!
        },
      }),
    ),
  )

const testLens = _<{ addresses: { street?: { name: string } }[] }>()
  ._(path('addresses'))
  ._(map((_) => _(path('street'))._(path('name'))))

type Person = {
  addresses: Address[]
  testing?: { deep: string }
} & ({ test: { deep: { stuff: 'foo' } } } | {})
type Street = { num: number; name: string }
type Address = { city: string; street: Street }

const test = _<Person>()._(path('test'))._(path('deep'))._(path('stuff'))
