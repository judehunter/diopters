import { test, expect, vi, describe } from 'vitest'
import { d, diopter } from '../src'

test('not a prism', () => {
  const data = [
    [1, 2],
    [3, 4],
    [5, 6],
  ]

  const diopter = d<typeof data>().flat()

  expect(diopter.isPrism).toBe(false)
})

test('2d matrix > get', () => {
  const data = [
    [1, 2],
    [3, 4],
    [5, 6],
  ]

  const diopter = d<typeof data>().flat()

  expect(diopter.get(data)).toEqual([1, 2, 3, 4, 5, 6])
})

test('2d matrix > set', () => {
  const data = [
    [1, 2],
    [3, 4],
    [5, 6],
  ]

  const diopter = d<typeof data>().flat()

  expect(diopter.set(data, () => [7, 8, 9, 10, 11, 12])).toEqual([
    [7, 8],
    [9, 10],
    [11, 12],
  ])
})

test('2d matrix > mod', () => {
  const data = [
    [1, 2],
    [3, 4],
    [5, 6],
  ]

  const diopter = d<typeof data>().flat()

  expect(diopter.set(data, (x) => x.map((y) => y * 10))).toEqual([
    [10, 20],
    [30, 40],
    [50, 60],
  ])
})

test('2d array with uneven lengths > get', () => {
  const data = [[1], [2, 3, 4], [5, 6]]

  const diopter = d<typeof data>().flat()

  expect(diopter.get(data)).toEqual([1, 2, 3, 4, 5, 6])
})

test('2d array with uneven lengths > set', () => {
  const data = [[1], [2, 3, 4], [5, 6]]

  const diopter = d<typeof data>().flat()

  expect(diopter.set(data, () => [7, 8, 9, 10, 11, 12])).toEqual([
    [7],
    [8, 9, 10],
    [11, 12],
  ])
})

test('2d array with uneven lengths > mod', () => {
  const data = [[1], [2, 3, 4], [5, 6]]

  const diopter = d<typeof data>().flat()

  expect(diopter.set(data, (x) => x.map((y) => y * 10))).toEqual([
    [10],
    [20, 30, 40],
    [50, 60],
  ])
})

test('3d array > get', () => {
  const data = [
    [[1]],
    [
      [2, 3, 4],
      [5, 6],
    ],
  ]

  const diopter = d<typeof data>().flat().flat()

  expect(diopter.get(data)).toEqual([1, 2, 3, 4, 5, 6])
})

test('3d array > set', () => {
  const data = [
    [[1]],
    [
      [2, 3, 4],
      [5, 6],
    ],
  ]

  const diopter = d<typeof data>().flat().flat()

  expect(diopter.set(data, () => [7, 8, 9, 10, 11, 12])).toEqual([
    [[7]],
    [
      [8, 9, 10],
      [11, 12],
    ],
  ])
})

test('3d array > mod', () => {
  const data = [
    [[1]],
    [
      [2, 3, 4],
      [5, 6],
    ],
  ]

  const diopter = d<typeof data>().flat().flat()

  expect(diopter.set(data, (list) => list.map((x) => x * 10))).toEqual([
    [[10]],
    [
      [20, 30, 40],
      [50, 60],
    ],
  ])
})

test('complex > get', () => {
  const data = [
    { a: [{ b: 1 }, { b: 2 }] },
    { a: [{ c: 3 }, { b: 4 }] },
    { a: [{ b: 5 }, { c: 6 }] },
  ]

  const diopter = d<typeof data>()
    .map((x) => x.a.map((y) => y.guard((z): z is { b: number } => 'b' in z).b))
    .flat()

  expect(diopter.get(data)).toEqual([1, 2, 4, 5])
})

test('complex > set', () => {
  const data = [
    { a: [{ b: 1 }, { b: 2 }] },
    { a: [{ c: 3 }, { b: 4 }] },
    { a: [{ b: 5 }, { c: 6 }] },
  ]

  const diopter = d<typeof data>()
    .map((x) => x.a.map((y) => y.guard((z): z is { b: number } => 'b' in z).b))
    .flat()

  expect(diopter.set(data, () => [7, 8, 9, 10])).toEqual([
    { a: [{ b: 7 }, { b: 8 }] },
    { a: [{ c: 3 }, { b: 9 }] },
    { a: [{ b: 10 }, { c: 6 }] },
  ])
})

test('complex > mod', () => {
  const data = [
    { a: [{ b: 1 }, { b: 2 }] },
    { a: [{ c: 3 }, { b: 4 }] },
    { a: [{ b: 5 }, { c: 6 }] },
  ]

  const diopter = d<typeof data>()
    .map((x) => x.a.map((y) => y.guard((z): z is { b: number } => 'b' in z).b))
    .flat()

  expect(diopter.set(data, (x) => x.map((y) => y * 10))).toEqual([
    { a: [{ b: 10 }, { b: 20 }] },
    { a: [{ c: 3 }, { b: 40 }] },
    { a: [{ b: 50 }, { c: 6 }] },
  ])
})

test('fails on data non-array > get', () => {
  const data = 1 as any

  const diopter = d<typeof data>().flat()

  expect(() => diopter.get(data)).toThrow('Not an array')
})

test('fails on data non-array > set', () => {
  const data = 1 as any

  const diopter = d<typeof data>().flat()

  expect(() => diopter.set(data, () => [1, 2])).toThrow('Not an array')
})

test('fails on data non-array > mod', () => {
  const data = 1 as any

  const diopter = d<typeof data>().flat()

  expect(() => diopter.set(data, (x) => x.map((y) => y * 10))).toThrow(
    'Not an array',
  )
})

test('fails on data non-2d array > get', () => {
  const data = [1, 2, 3] as any

  const diopter = d<typeof data>().flat()

  expect(() => diopter.get(data)).toThrow('Not a 2d array')
})

test('fails on data non-2d array > set', () => {
  const data = [1, 2, 3] as any

  const diopter = d<typeof data>().flat()

  expect(() => diopter.set(data, () => [1, 2])).toThrow('Not a 2d array')
})

test('fails on data non-2d array > mod', () => {
  const data = [1, 2, 3] as any

  const diopter = d<typeof data>().flat()

  expect(() => diopter.set(data, (x) => x.map((y) => y * 10))).toThrow(
    'Not a 2d array',
  )
})

test('fails on array length mismatch > set', () => {
  const data = [
    [1, 2],
    [3, 4, 5],
  ]

  const diopter = d<typeof data>().flat()

  expect(() => diopter.set(data, () => [1, 2])).toThrow(
    'Modified array length mismatch',
  )
})

test('fails on array length mismatch > mod', () => {
  const data = [
    [1, 2],
    [3, 4, 5],
  ]

  const diopter = d<typeof data>().flat()

  expect(() =>
    diopter.set(data, (x) => x.map((y) => y * 10).slice(0, 2)),
  ).toThrow('Modified array length mismatch')
})
