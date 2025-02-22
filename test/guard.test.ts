import { test, expect, vi, describe } from 'vitest'
import { d, diopter } from '../src'

test('is a prism', () => {
  const data = 1 as number | string

  const diopter = d<typeof data>().guard((x) => typeof x === 'number')

  expect(diopter.isPrism).toBe(true)
})

test('truthy predicate > equivalence of application', () => {
  const data = 1 as number | string

  const diopter = d<typeof data>()
    .guard((x) => typeof x === 'number')
    .guard((x) => typeof x === 'number')

  expect(diopter.get(data)).toBe(1)
  expect(diopter.set(data, () => 2)).toBe(2)
  expect(diopter.set(data, (x) => x + 1)).toBe(2)
})

test('truthy predicate > get', () => {
  const data = 1 as number | string

  const diopter = d<typeof data>().guard((x) => typeof x === 'number')

  expect(diopter.get(data)).toBe(1)
})

test('truthy predicate > set', () => {
  const data = 1 as number | string

  const diopter = d<typeof data>().guard((x) => typeof x === 'number')

  expect(diopter.set(data, () => 2)).toBe(2)
})

test('truthy predicate > mod', () => {
  const data = 1 as number | string

  const diopter = d<typeof data>().guard((x) => typeof x === 'number')

  expect(diopter.set(data, (x) => x + 1)).toBe(2)
})

test('falsy predicate > is a prism', () => {
  const data = 1 as number | string

  const diopter = d<typeof data>().guard((x) => typeof x === 'string')

  expect(diopter.isPrism).toBe(true)
})

test('falsy predicate > get', () => {
  const data = 1 as number | string

  const diopter = d<typeof data>().guard((x) => typeof x === 'string')

  expect(diopter.get(data)).toBe(undefined)
})

test('falsy predicate > set', () => {
  const data = 1 as number | string

  const diopter = d<typeof data>().guard((x) => typeof x === 'string')

  expect(diopter.set(data, () => 'foo')).toBe(1)
})

test('falsy predicate > mod', () => {
  const data = 1 as number | string

  const diopter = d<typeof data>().guard((x) => typeof x === 'string')

  expect(diopter.set(data, (x) => x + 'bar')).toBe(1)
})

test('falsy predicate > equivalence of application', () => {
  const data = 1 as number | string

  const diopter = d<typeof data>()
    .guard((x) => typeof x === 'string')
    .guard((x) => typeof x === 'string')

  expect(diopter.get(data)).toBe(undefined)
  expect(diopter.set(data, () => 'foo')).toBe(1)
  expect(diopter.set(data, (x) => x + 'bar')).toBe(1)
})
