import { d } from '../d'
import { diopter } from '../diopter'

export const makeMap = (mapFn: (a: any) => any) => {
  const get = (a) => {
    if (!Array.isArray(a)) {
      throw new Error('Not an array')
    }
    return a
      .map((elem, i) => {
        const elemLens = d<typeof elem>()
        const transformedLens = mapFn(elemLens as any)
        const transformed = transformedLens.get(elem)
        return transformed
      })
      .filter((x): x is NonNullable<typeof x> => x !== undefined && x !== null)
  }

  return diopter({
    get,
    set: ((a, modFn) => {
      if (!Array.isArray(a)) {
        throw new Error('Not an array')
      }
      const valuesWithUndefs = a.map((elem, i) => {
        const elemLens = d<typeof elem>()
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
          const elemLens = d<typeof elem>()
          const transformedLens = mapFn(elemLens as any)
          const transformed = transformedLens.set(elem, () => modified[i])
          return transformed
        })
    }) as any,
    debug: `map(${mapFn.toString()})`,
  })
}
