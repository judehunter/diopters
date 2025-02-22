import { diopter } from '../diopter'

export const makeFlat = () => {
  return diopter({
    get: (a) => {
      if (!Array.isArray(a)) {
        throw new Error('Not an array')
      }

      return a.reduce((acc, row) => {
        if (!Array.isArray(row)) throw new Error('Not a 2d array')
        return acc.concat(row)
      }, [])
    },
    set: ((a, modFn) => {
      if (!Array.isArray(a)) {
        throw new Error('Not an array')
      }

      const flat = a.reduce((acc, row) => {
        if (!Array.isArray(row)) {
          throw new Error('Not a 2d array')
        }
        return acc.concat(row)
      }, [])

      const modded = modFn(flat)

      if (modded.length !== flat.length) {
        throw new Error('Modified array length mismatch')
      }

      let index = 0
      const new2d = a.map((row) => {
        const len = row.length
        const newRow = modded.slice(index, index + len)
        index += len
        return newRow
      })
      return new2d
    }) as any,
    debug: 'flat',
  })
}
