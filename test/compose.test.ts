import { test, expect, vi, describe } from 'vitest'
import { d, diopter } from '../src'

test('is a prism when left is a prism', () => {
  const data = { a: { b: 1 } } as { a: { b: 1 } | undefined }

  const inner = d<{ b: 1 }>().b
  const diopter = d<typeof data>().a.opt().compose(inner)

  expect(diopter.isPrism).toBe(true)
})
test('is a prism when right is a prism', () => {
  const data = { a: { b: 1 } } as { a: { b: 1 | undefined } }

  const inner = d<{ b: 1 | undefined }>().b.opt()
  const diopter = d<typeof data>().a.compose(inner)

  expect(diopter.isPrism).toBe(true)
})
test('is a prism when left and right are prisms', () => {
  const data = { a: { b: 1 } } as { a: { b: 1 | undefined } | undefined }

  const inner = d<{ b: 1 | undefined }>().b.opt()
  const diopter = d<typeof data>().a.opt().compose(inner)

  expect(diopter.isPrism).toBe(true)
})
test('is not a prism when left and right are not prisms', () => {
  const data = { a: { b: 1 } }

  const inner = d<{ b: 1 }>().b
  const diopter = d<typeof data>().a.compose(inner)

  expect(diopter.isPrism).toBe(false)
})

test('with another build-in diopter > get', () => {
  const data = { a: { b: 1 } }

  const inner = d<(typeof data)['a']>().b
  const diopter = d<typeof data>().a.compose(inner)

  expect(diopter.get(data)).toBe(1)
})

test('with another build-in diopter > get', () => {
  const data = { a: { b: 1 } }

  const inner = d<(typeof data)['a']>().b
  const diopter = d<typeof data>().a.compose(inner)

  expect(diopter.set(data, () => 2)).toEqual({ a: { b: 2 } })
})

test('with another build-in diopter > mod', () => {
  const data = { a: { b: 1 } }

  const inner = d<(typeof data)['a']>().b
  const diopter = d<typeof data>().a.compose(inner)

  expect(diopter.set(data, (x) => x * 10)).toEqual({ a: { b: 10 } })
})

test('with custom diopter > get', () => {
  const data = { a: { b: 1 } }

  const custom = diopter<{ b: number }, number, false>({
    get: (val) => val.b,
    set: (val, modFn) => ({ ...val, b: modFn(val.b) }),
  })

  const myDiopter = d<typeof data>().a.compose(custom)

  expect(myDiopter.get(data)).toBe(1)
})

test('with custom diopter > set', () => {
  const data = { a: { b: 1 } }

  const custom = diopter<{ b: number }, number, false>({
    get: (val) => val.b,
    set: (val, modFn) => ({ ...val, b: modFn(val.b) }),
  })

  const myDiopter = d<typeof data>().a.compose(custom)

  expect(myDiopter.set(data, () => 2)).toEqual({ a: { b: 2 } })
})

test('with custom diopter > mod', () => {
  const data = { a: { b: 1 } }

  const custom = diopter<{ b: number }, number, false>({
    get: (val) => val.b,
    set: (val, modFn) => ({ ...val, b: modFn(val.b) }),
  })

  const myDiopter = d<typeof data>().a.compose(custom)

  expect(myDiopter.set(data, (x) => x * 10)).toEqual({ a: { b: 10 } })
})
