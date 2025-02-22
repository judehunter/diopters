import { expect } from 'vitest'
import { test } from 'vitest'
import { d } from '../src'

test('path on last fragment > is a prism', () => {
  const data = { a: { b: { c: undefined as number | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt()

  expect(diopter.isPrism).toBe(true)
})

test('path with more fragments > is a prism', () => {
  const data = { a: { b: { c: undefined as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.isPrism).toBe(true)
})

test('path with more fragments > undefined > get', () => {
  const data = { a: { b: { c: undefined as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.get(data)).toBe(undefined)
})

test('path with more fragments > undefined > set', () => {
  const data = { a: { b: { c: undefined as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.set(data, () => 2)).toEqual({ a: { b: { c: undefined } } })
})

test('path with more fragments > undefined > mod', () => {
  const data = { a: { b: { c: undefined as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.set(data, (x) => x + 1)).toEqual({
    a: { b: { c: undefined } },
  })
})

test('path with more fragments > defined > get', () => {
  const data = { a: { b: { c: { d: 1 } as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.get(data)).toBe(1)
})

test('path with more fragments > defined > set', () => {
  const data = { a: { b: { c: { d: 1 } as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.set(data, () => 2)).toEqual({ a: { b: { c: { d: 2 } } } })
})

test('path with more fragments > defined > mod', () => {
  const data = { a: { b: { c: { d: 1 } as { d: number } | undefined } } }

  const diopter = d<typeof data>().a.b.c.opt().d

  expect(diopter.set(data, (x) => x + 1)).toEqual({
    a: { b: { c: { d: 2 } } },
  })
})

test('null > get', () => {
  const data = null

  const diopter = d<{ a: number } | null>().opt().a

  expect(diopter.get(data)).toBe(undefined)
})

test('null > set', () => {
  const data = null

  const diopter = d<{ a: number } | null>().opt().a

  expect(diopter.set(data, () => 2)).toBe(null)
})

test('null > mod', () => {
  const data = null

  const diopter = d<{ a: number } | null>().opt().a

  expect(diopter.set(data, (x) => x + 1)).toBe(null)
})
