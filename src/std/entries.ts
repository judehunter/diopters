import { diopter } from '../diopter'

export const makeEntries = () => {
  return diopter({
    get: (from: unknown) => {
      if (typeof from !== 'object' || from === null) {
        throw new Error('Not an object')
      }

      return Object.entries(from)
    },
    set: (on, modFn) => {
      if (typeof on !== 'object' || on === null) {
        throw new Error('Not an object')
      }

      return Object.fromEntries(modFn(Object.entries(on)))
    },
    debug: 'entries',
  })
}
