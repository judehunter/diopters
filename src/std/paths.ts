import { AccessDistr } from '../utils'
import { KeyOfDistr } from '../utils'
import { diopter, Diopter } from '../diopter'
import { NonUndef } from '../utils'

export type Paths<A, B, isPrism extends boolean> = undefined extends B
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
            return { ...a, [prop]: modFn(a[prop]) }
          },
          debug: prop as string,
        }),
      )
    },
  })
}
