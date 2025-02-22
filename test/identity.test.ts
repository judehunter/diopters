import { test, expect, vi, describe } from 'vitest'
import { d, diopter } from '../src'

test('not a prism', () => {
  const data = 1 as number

  const diopter = d<typeof data>()

  expect(diopter.isPrism).toBe(false)
})

test('get', () => {
  const data = 1 as number

  const diopter = d<typeof data>()

  expect(diopter.get(data)).toBe(1)
})

test('set', () => {
  const data = 1 as number

  const diopter = d<typeof data>()

  expect(diopter.set(data, () => 2)).toBe(2)
})

test('mod', () => {
  const data = 1 as number

  const diopter = d<typeof data>()

  expect(diopter.set(data, (x) => x + 1)).toBe(2)
})
