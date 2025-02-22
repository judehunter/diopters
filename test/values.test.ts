import { test, expect, vi, describe } from 'vitest'
import { d, diopter } from '../src'

test('not a prism', () => {
  const data = { a: 1, b: 2 }

  const diopter = d<typeof data>().values()

  expect(diopter.isPrism).toBe(false)
})

test('basic > get', () => {
  const data = { a: 1, b: 2 }

  const diopter = d<typeof data>().values()

  expect(diopter.get(data)).toEqual([1, 2])
})

test('basic > set', () => {
  const data = { a: 1, b: 2 }

  const diopter = d<typeof data>().values()

  expect(diopter.set(data, () => [10, 20])).toEqual({
    a: 10,
    b: 20,
  })
})

test('basic > mod', () => {
  const data = { a: 1, b: 2 }

  const diopter = d<typeof data>().values()

  expect(diopter.set(data, (x) => x.map((y) => y * 10))).toEqual({
    a: 10,
    b: 20,
  })
})

test('advanced use case > get', () => {
  const data = { a: { b: 1 }, c: { d: 2 }, e: undefined }

  const diopter = d<typeof data>()
    .values()
    .map((x) => x.opt().values())
    .flat()

  expect(diopter.get(data)).toEqual([1, 2])
})

test('advanced use case > set', () => {
  const data = { a: { b: 1 }, c: { d: 2 }, e: undefined }

  const diopter = d<typeof data>()
    .values()
    .map((x) => x.opt().values())
    .flat()

  expect(diopter.set(data, () => [10, 20])).toEqual({
    a: { b: 10 },
    c: { d: 20 },
    e: undefined,
  })
})

test('advanced use case > mod', () => {
  const data = { a: { b: 1 }, c: { d: 2 }, e: undefined }

  const diopter = d<typeof data>()
    .values()
    .map((x) => x.opt().values())
    .flat()

  expect(diopter.set(data, (x) => x.map((y) => y * 10))).toEqual({
    a: { b: 10 },
    c: { d: 20 },
    e: undefined,
  })
})

test('fails on non-object data > get', () => {
  const data = 1

  const diopter = d<any>().values()

  expect(() => diopter.get(data)).toThrow('Not an object')
})

test('fails on non-object data > set', () => {
  const data = 1

  const diopter = d<any>().values()

  expect(() => diopter.set(data, () => [10, 20])).toThrow('Not an object')
})

test('fails on non-object data > mod', () => {
  const data = 1

  const diopter = d<any>().values()

  expect(() => diopter.set(data, (x) => x.map((y) => y * 10))).toThrow(
    'Not an object',
  )
})
