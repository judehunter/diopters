import { test, expect, vi, describe } from 'vitest'
import { d, diopter } from '../src'

test('not a prism', () => {
  const data = { a: 1, b: 2, c: 3 }

  const diopter = d<typeof data>().pick(['a', 'b'])

  expect(diopter.isPrism).toBe(false)
})

test('get', () => {
  const data = { a: 1, b: 2, c: 3 }

  const diopter = d<typeof data>().pick(['a', 'b'])

  expect(diopter.get(data)).toEqual({ a: 1, b: 2 })
})

test('set', () => {
  const data = { a: 1, b: 2, c: 3 }

  const diopter = d<typeof data>().pick(['a', 'b'])

  expect(diopter.set(data, () => ({ a: 4, b: 5 }))).toEqual({
    a: 4,
    b: 5,
    c: 3,
  })
})

test('set', () => {
  const data = { a: 1, b: 2, c: 3 }

  const diopter = d<typeof data>().pick(['a', 'b'])

  expect(diopter.set(data, (cur) => ({ ...cur, a: 4 }))).toEqual({
    a: 4,
    b: 2,
    c: 3,
  })
})

test('fails on data non-object > get', () => {
  const data = null as any

  const diopter = d<typeof data>().pick(['a', 'b'])

  expect(() => diopter.get(data)).toThrow('Not an object')
})

test('fails on data non-object > set', () => {
  const data = null as any

  const diopter = d<typeof data>().pick(['a', 'b'])

  expect(() => diopter.set(data, () => ({ a: 4, b: 5 }))).toThrow(
    'Not an object',
  )
})

test('fails on data non-object > mod', () => {
  const data = null as any

  const diopter = d<typeof data>().pick(['a', 'b'])

  expect(() => diopter.set(data, (x) => x)).toThrow('Not an object')
})

test('fails on modified non-object > set', () => {
  const data = { a: 1, b: 2 }

  const diopter = d<typeof data>().pick(['a', 'b'])

  expect(() => diopter.set(data, () => 1 as any)).toThrow(
    'Modified value is not an object',
  )
})

test('fails on additional modified keys > set', () => {
  const data = { a: 1, b: 2 }

  const diopter = d<typeof data>().pick(['a', 'b'])

  expect(() => diopter.set(data, () => ({ a: 4, c: 5 }) as any)).toThrow(
    'Modified value has unexpected key: c',
  )
})

test('fails on missing modified keys > set', () => {
  const data = { a: 1, b: 2 }

  const diopter = d<typeof data>().pick(['a', 'b'])

  expect(() => diopter.set(data, () => ({ a: 4 }) as any)).toThrow(
    'Modified value does not specify all keys',
  )
})

test.skip('undefined values')
test.skip('non-existing keys')
