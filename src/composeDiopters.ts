import { Diopter, diopter } from './diopter'

export const composeDiopters = <
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
