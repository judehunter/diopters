import { test, expect } from 'vitest'
import { d } from '../src'

test('not a prism', () => {
  const data = { a: 10, b: 20 }

  const diopter = d<typeof data>().entries()

  expect(diopter.isPrism).toBe(false)
})

test('basic > get', () => {
  const data = { a: 10, b: 20 }

  const diopter = d<typeof data>().entries()

  expect(diopter.get(data)).toEqual([
    ['a', 10],
    ['b', 20],
  ])
})

test('basic > set', () => {
  const data = { a: 10, b: 20 }

  const diopter = d<typeof data>().entries()

  // todo: enforce that all keys are present
  expect(
    diopter.set(data, () => [
      ['b', 10],
      ['a', 20],
    ]),
  ).toEqual({
    a: 20,
    b: 10,
  })
})

test('basic > mod', () => {
  const data = { a: 10, b: 20 }

  const diopter = d<typeof data>().entries()

  expect(
    diopter.set(data, (x) =>
      x.map((y) => [y[0] === 'a' ? 'b' : 'a', y[1] * 10]),
    ),
  ).toEqual({
    a: 200,
    b: 100,
  })
})

test('advanced use case > get', () => {
  const data = { a: { b: 1 }, c: { d: 2 }, e: undefined }

  const diopter = d<typeof data>()
    .values()
    .map((x) =>
      x
        .opt()
        .entries()
        .map((y) => y.guard(([k]) => k === 'b')[1]),
    )
    .flat()

  expect(diopter.get(data)).toEqual([1])
})

test('advanced use case > set', () => {
  const data = { a: { b: 1 }, c: { d: 2 }, e: undefined }

  const diopter = d<typeof data>()
    .values()
    .map((x) =>
      x
        .opt()
        .entries()
        .map((y) => y.guard(([k]) => k === 'b')[1]),
    )
    .flat()

  expect(diopter.set(data, () => [10])).toEqual({
    a: { b: 10 },
    c: { d: 2 },
    e: undefined,
  })
})

test('advanced use case > mod', () => {
  const data = { a: { b: 1 }, c: { d: 2 }, e: undefined }

  const diopter = d<typeof data>()
    .values()
    .map((x) =>
      x
        .opt()
        .entries()
        .map((y) => y.guard(([k]) => k === 'b')[1]),
    )
    .flat()

  expect(diopter.set(data, (x) => x.map((y) => y * 10))).toEqual({
    a: { b: 10 },
    c: { d: 2 },
    e: undefined,
  })
})
