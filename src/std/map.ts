import { d } from '../d'
import { Diopter, diopter } from '../diopter'

export const makeMap = (mapFn: (a: any) => Diopter<any, any, boolean>) => {
  const get = (a) => {
    if (!Array.isArray(a)) {
      throw new Error('Not an array')
    }
    const elemLens = d()
    const mapLens = mapFn(elemLens as any)
    return a.flatMap((elem) => {
      const mapped = mapLens.get(elem)
      if (mapLens.isPrism && mapped === undefined) {
        return []
      }
      return [mapped]
    })
  }

  return diopter({
    get,
    set: ((a, modFn) => {
      if (!Array.isArray(a)) {
        throw new Error('Not an array')
      }
      const elemLens = d()
      const mapLens = mapFn(elemLens as any)

      const values = a.map((elem, i) => mapLens.get(elem))

      if (!mapLens.isPrism) {
        const modified = modFn(values)
        if (!Array.isArray(modified)) {
          throw new Error('Modified is not an array')
        }
        if (modified.length !== values.length) {
          throw new Error('Array length mismatch')
        }
        return a.map((elem, i) => {
          return mapLens.set(elem, () => modified[i])
        })
      }

      const definedIndices = values.flatMap((x, i) =>
        x === undefined ? [] : [i],
      )

      const definedValues = values.filter(
        (x): x is NonNullable<typeof x> => x !== undefined,
      )

      const modified = modFn(definedValues)

      if (!Array.isArray(modified)) {
        throw new Error('Modified is not an array')
      }
      if (modified.length !== definedValues.length) {
        throw new Error('Array length mismatch')
      }

      return a.map((elem, i) => {
        if (!definedIndices.includes(i)) {
          return elem
        }
        return mapLens.set(elem, () => modified[definedIndices.indexOf(i)])
      })
    }) as any,
    debug: `map(${mapFn.toString()})`,
  })
}
