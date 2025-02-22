import { diopter } from '../diopter'

export const makeValues = () => {
  return diopter({
    get: (from: unknown) => {
      if (typeof from !== 'object' || from === null) {
        throw new Error('Not an object')
      }

      return Object.values(from)
    },
    set: (on, modFn) => {
      if (typeof on !== 'object' || on === null) {
        throw new Error('Not an object')
      }

      const values = Object.values(on)
      const modded = modFn(values)

      const stitchedWithKeys = modded.map((value, index) => [
        Object.keys(on)[index],
        value,
      ])

      return Object.fromEntries(stitchedWithKeys)
    },
    debug: 'elems',
  })
}
