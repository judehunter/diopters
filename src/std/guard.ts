import { diopter } from '../diopter'

export const makeGuard = (predicate: (a: any) => boolean) =>
  diopter({
    get: (a) => {
      return predicate(a) ? a : undefined
    },
    set: (a, modFn) => {
      return predicate(a) ? modFn(a) : a
    },
    isPrism: true,
  })
