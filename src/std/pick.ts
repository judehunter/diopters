import { diopter } from '../diopter'

export const makePick = (keys: string[]) =>
  diopter({
    get: (a: Record<string, any>) => {
      if (typeof a !== 'object' || a === null) {
        throw new Error('Not an object')
      }
      return keys.reduce((acc, key) => {
        acc[key] = a[key]
        return acc
      }, {} as any)
    },
    set: (a, modFn) => {
      if (typeof a !== 'object' || a === null) {
        throw new Error('Not an object')
      }
      const subA = keys.reduce((acc, key) => {
        acc[key] = a[key]
        return acc
      }, {} as any)
      const modded = modFn(subA)
      if (typeof modded !== 'object' || modded === null) {
        throw new Error('Modified value is not an object')
      }
      for (const moddedKey of Object.keys(modded)) {
        if (!keys.includes(moddedKey)) {
          throw new Error(`Modified value has unexpected key: ${moddedKey}`)
        }
      }
      if (Object.keys(modded).length !== keys.length) {
        throw new Error('Modified value does not specify all keys')
      }
      return keys.reduce((acc, key) => {
        acc[key] = modded[key]
        return acc
      }, a as any)
    },
    isPrism: false,
  })
