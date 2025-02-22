import { AccessDistr, Keys, KeysDistr } from '../utils'
import { diopter, Diopter } from '../diopter'
import { NonUndef } from '../utils'

export type Paths<A, B, isPrism extends boolean> = undefined extends B
  ? {}
  : {
      [K in Keys<B> | KeysDistr<B>]: K extends keyof B
        ? undefined extends B[K]
          ? Diopter<A, NonUndef<B[K]> | undefined, isPrism>
          : Diopter<A, B[K], isPrism>
        : K extends KeysDistr<B>
          ? Diopter<A, AccessDistr<B, K> | undefined, isPrism>
          : never
    }

export const paths = (target: Record<string, any>, compose: any) => {
  return new Proxy(target, {
    get(target, prop) {
      if (prop in target) {
        return target[prop as any]
      }

      return compose(
        diopter({
          get: (a: any) => {
            return a[prop as any]
          },
          set: (a, modFn) => {
            if (typeof prop === 'symbol') {
              throw new Error('Symbols are not supported')
            }
            if (Array.isArray(a)) {
              return a.map((x, i) => (i === +prop ? modFn(x) : x))
            }
            return { ...a, [prop]: modFn(a[prop]) }
          },
          debug: typeof prop === 'symbol' ? '<symbol>' : prop,
        }),
      )
    },
  })
}
