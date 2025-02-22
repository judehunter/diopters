import { test, expect, vi, describe } from 'vitest'
import { d, diopter } from '../src'

test('defined > not a prism', () => {
  const data = { a: 1 as number }

  const diopter = d<typeof data>().a

  expect(diopter.isPrism).toBe(false)
})

test('defined > get', () => {
  const data = { a: 1 as number }

  const diopter = d<typeof data>().a

  expect(diopter.get(data)).toBe(1)
})

test('defined > set', () => {
  const data = { a: 1 as number }

  const diopter = d<typeof data>().a

  expect(diopter.set(data, () => 2)).toEqual({ a: 2 })
})

test('defined > mod', () => {
  const data = { a: 1 as number }

  const diopter = d<typeof data>().a

  expect(diopter.set(data, (x) => x + 1)).toEqual({ a: 2 })
})

test('defined (deep) > get', () => {
  const data = { a: { b: { c: undefined as number | undefined } } }

  const diopter = d<typeof data>().a.b.c

  expect(diopter.get(data)).toBe(undefined)
})

test('defined (deep) > set', () => {
  const data = { a: { b: { c: 1 as number } } }

  const diopter = d<typeof data>().a.b.c

  expect(diopter.set(data, () => 2)).toEqual({ a: { b: { c: 2 } } })
})

test('defined (deep) > mod', () => {
  const data = { a: { b: { c: 1 as number } } }

  const diopter = d<typeof data>().a.b.c

  expect(diopter.set(data, (x) => x + 1)).toEqual({ a: { b: { c: 2 } } })
})

test('undefined > not a prism', () => {
  const data = { a: undefined as number | undefined }

  const diopter = d<typeof data>().a

  expect(diopter.isPrism).toBe(false)
})

test('undefined > get', () => {
  const data = { a: undefined as number | undefined }

  const diopter = d<typeof data>().a

  expect(diopter.get(data)).toBe(undefined)
})

test('undefined > set', () => {
  const data = { a: undefined as number | undefined }

  const diopter = d<typeof data>().a

  expect(diopter.set(data, () => 2)).toEqual({ a: 2 })
})

test('undefined > mod', () => {
  const data = { a: undefined as number | undefined }

  const diopter = d<typeof data>().a

  const spy = vi.fn()
  diopter.set(data, spy)
  expect(spy.mock.calls).toEqual([[undefined]])

  expect(diopter.set(data, (x) => (x === undefined ? 3 : x + 1))).toEqual({
    a: 3,
  })
})

test('undefined (deep) > get', () => {
  const data = { a: { b: { c: undefined as number | undefined } } }

  const diopter = d<typeof data>().a.b.c

  expect(diopter.get(data)).toBe(undefined)
})

test('undefined (deep) > set', () => {
  const data = { a: { b: { c: undefined as number | undefined } } }

  const diopter = d<typeof data>().a.b.c

  expect(diopter.set(data, () => 2)).toEqual({ a: { b: { c: 2 } } })
})

test('undefined (deep) > mod', () => {
  const data = { a: { b: { c: undefined as number | undefined } } }

  const diopter = d<typeof data>().a.b.c

  const spy = vi.fn()
  diopter.set(data, spy)
  expect(spy.mock.calls).toEqual([[undefined]])

  expect(diopter.set(data, (x) => (x === undefined ? 3 : x + 1))).toEqual({
    a: { b: { c: 3 } },
  })
})

test('.opt() on last fragment > is a prism', () => {
  const data = { a: { b: { c: undefined as number | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt()

  expect(diopter.isPrism).toBe(true)
})

test('.opt() with more fragments > is a prism', () => {
  const data = { a: { b: { c: undefined as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.isPrism).toBe(true)
})

test('.opt() with more fragments > undefined > get', () => {
  const data = { a: { b: { c: undefined as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.get(data)).toBe(undefined)
})

test('.opt() with more fragments > undefined > set', () => {
  const data = { a: { b: { c: undefined as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.set(data, () => 2)).toEqual({ a: { b: { c: undefined } } })
})

test('.opt() with more fragments > undefined > mod', () => {
  const data = { a: { b: { c: undefined as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.set(data, (x) => x + 1)).toEqual({
    a: { b: { c: undefined } },
  })
})

test('.opt() with more fragments > defined > get', () => {
  const data = { a: { b: { c: { d: 1 } as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.get(data)).toBe(1)
})

test('.opt() with more fragments > defined > set', () => {
  const data = { a: { b: { c: { d: 1 } as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.set(data, () => 2)).toEqual({ a: { b: { c: { d: 2 } } } })
})

test('.opt() with more fragments > defined > mod', () => {
  const data = { a: { b: { c: { d: 1 } as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.set(data, (x) => x + 1)).toEqual({
    a: { b: { c: { d: 2 } } },
  })
})

test('array index > get', () => {
  const data = [[1], [2], [3]] as number[][]

  const diopter = d<typeof data>()[1][0]

  expect(diopter.get(data)).toBe(2)
})

test('array index > set', () => {
  const data = [[1], [2], [3]] as number[][]

  const diopter = d<typeof data>()[1][0]

  expect(diopter.set(data, () => 4)).toEqual([[1], [4], [3]])
})

test('array index > mod', () => {
  const data = [[1], [2], [3]] as number[][]

  const diopter = d<typeof data>()[1][0]

  expect(diopter.set(data, (x) => x * 10)).toEqual([[1], [20], [3]])
})

test('fails on symbol > set', () => {
  const symbol = Symbol('foo')
  const data = { [symbol]: 1 }

  const diopter = d<typeof data>()[symbol]

  expect(() => diopter.set(data, () => 2)).toThrow('Symbols are not supported')
})
