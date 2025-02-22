import { test, expect, vi, describe } from 'vitest'
import { d, diopter } from '../src'

test('not a prism', () => {
  const data = [{ a: 1 }, { a: 2 }, { a: 3 }] as { a: number }[]

  const diopter = d<typeof data>().map((x) => x)

  expect(diopter.isPrism).toBe(false)
})

test('fails on data non-array > get', () => {
  const data = 1 as any as number[]

  const diopter = d<typeof data>().map((x) => x)

  expect(() => diopter.get(data)).toThrow('Not an array')
})

test('fails on data non-array > set', () => {
  const data = 1 as any as number[]

  const diopter = d<typeof data>().map((x) => x)

  expect(() => diopter.set(data, () => [1, 2, 3])).toThrow('Not an array')
})

test('fails on data non-array > mod', () => {
  const data = 1 as any as number[]

  const diopter = d<typeof data>().map((x) => x)

  expect(() => diopter.set(data, (x) => x.map((y) => y * 2))).toThrow(
    'Not an array',
  )
})

test('fails on modified non-array > set & mod', () => {
  const data = [1, 2, 3] as number[]

  const diopter = d<typeof data>().map((x) => x)

  expect(() => diopter.set(data, () => 1 as any)).toThrow(
    'Modified is not an array',
  )
  expect(() => diopter.set(data, (x) => x.length as any)).toThrow(
    'Modified is not an array',
  )
})

test('identity map function', () => {
  const data = [{ a: 1 }, { a: 2 }, { a: 3 }] as { a: number }[]

  const diopter = d<typeof data>().map((x) => x)

  expect(diopter.get(data)).toEqual(data)
})

test('get', () => {
  const data = [{ a: 1 }, { a: 2 }, { a: 3 }] as { a: number }[]

  const diopter = d<typeof data>().map((x) => x.a)

  expect(diopter.get(data)).toEqual([1, 2, 3])
})

test('set', () => {
  const data = [{ a: 1 }, { a: 2 }, { a: 3 }] as { a: number }[]

  const diopter = d<typeof data>().map((x) => x.a)

  expect(diopter.set(data, () => [4, 5, 6])).toEqual([
    { a: 4 },
    { a: 5 },
    { a: 6 },
  ])
})

test('mod', () => {
  const data = [{ a: 1 }, { a: 2 }, { a: 3 }] as { a: number }[]

  const diopter = d<typeof data>().map((x) => x.a)

  expect(diopter.set(data, (arr) => arr.map((x) => x * 3))).toEqual([
    { a: 3 },
    { a: 6 },
    { a: 9 },
  ])
})

test('nested > get', () => {
  const data = [{ a: [{ b: 1 }] }, { a: [{ b: 2 }] }, { a: [{ b: 3 }] }] as {
    a: { b: number }[]
  }[]

  const diopter = d<typeof data>().map((x) => x.a.map((y) => y.b))

  expect(diopter.get(data)).toEqual([[1], [2], [3]])
})

test('fails on modified array length mismatch > set', () => {
  const data = [1, 2, 3]

  const diopter = d<typeof data>().map((x) => x)

  expect(() => diopter.set(data, () => [4, 5])).toThrow()
  expect(() => diopter.set(data, () => [4, 5, 6, 7])).toThrow()
})

test('fails on array length mismatch (with undefs) > set', () => {
  const data = [1, undefined, 3, undefined] as (number | undefined)[]

  const diopter = d<typeof data>().map((x) => x)

  expect(() => diopter.set(data, () => [4])).toThrow()
  expect(() => diopter.set(data, () => [4, 5, 6])).toThrow()
})

test('nested > set #1', () => {
  const data = [{ a: [{ b: 1 }] }, { a: [{ b: 2 }] }, { a: [{ b: 3 }] }] as {
    a: { b: number }[]
  }[]

  const diopter = d<typeof data>().map((x) => x.a.map((y) => y.b))

  expect(diopter.set(data, () => [[4], [5], [6]])).toEqual([
    { a: [{ b: 4 }] },
    { a: [{ b: 5 }] },
    { a: [{ b: 6 }] },
  ])
})

test('nested > set #2', () => {
  const data = [{ a: [1, 2] }, { a: [3, 4] }] as { a: number[] }[]

  const diopter = d<typeof data>().map((x) => x.a.map((y) => y))

  expect(
    diopter.set(data, () => [
      [5, 6],
      [7, 8],
    ]),
  ).toEqual([{ a: [5, 6] }, { a: [7, 8] }])
})

test('nested > set #3', () => {
  const data = [
    [{ a: 1 }, { a: 2 }],
    [{ a: 3 }, { a: 4 }],
  ] as { a: number }[][]

  const diopter = d<typeof data>().map((x) => x.map((y) => y.a))

  expect(
    diopter.set(data, () => [
      [5, 6],
      [7, 8],
    ]),
  ).toEqual([
    [{ a: 5 }, { a: 6 }],
    [{ a: 7 }, { a: 8 }],
  ])
})

test('nested > mod', () => {
  const data = [
    [1, 2],
    [3, 4],
  ] as number[][]

  const diopter = d<typeof data>().map((x) => x.map((y) => y))

  expect(diopter.set(data, (x) => x.map((y) => y.map((z) => z * 10)))).toEqual([
    [10, 20],
    [30, 40],
  ])
})

test('undefined elements > get', () => {
  const data = [1, undefined, 3] as (number | undefined)[]

  const diopter = d<typeof data>().map((x) => x)

  expect(diopter.get(data)).toEqual([1, 3])
})

test('undefined elements > set', () => {
  const data = [1, undefined, 3] as (number | undefined)[]

  const diopter = d<typeof data>().map((x) => x)

  expect(diopter.set(data, () => [4, 6])).toEqual([4, undefined, 6])
})

test('undefined elements > mod', () => {
  const data = [1, undefined, 3] as (number | undefined)[]

  const diopter = d<typeof data>().map((x) => x)

  expect(diopter.set(data, (x) => x.map((y) => y * 10))).toEqual([
    10,
    undefined,
    30,
  ])
})

test('undefined elements > nested > get', () => {
  const data = [[1, 2], [3, undefined], undefined]

  const diopter = d<typeof data>()
    .map((x) => x)
    .map((x) => x.map((y) => y))

  expect(diopter.get(data)).toEqual([[1, 2], [3]])
})

test('undefined elements > nested > set', () => {
  const data = [[1, 2], [3, undefined], undefined]

  const diopter = d<typeof data>()
    .map((x) => x)
    .map((x) => x.map((y) => y))

  expect(diopter.set(data, () => [[4, 5], [6]])).toEqual([
    [4, 5],
    [6, undefined],
    undefined,
  ])
})

test('undefined elements > nested > set', () => {
  const data = [[1, 2], [3, undefined], undefined]

  const diopter = d<typeof data>()
    .map((x) => x)
    .map((x) => x.map((y) => y))

  expect(diopter.set(data, (x) => [[x[0][0] * 10, 5], [6]])).toEqual([
    [10, 5],
    [6, undefined],
    undefined,
  ])
})

test('with guard > get', () => {
  const data = [1, 2, 3, 4]

  const diopter = d<typeof data>().map((x) => x.guard((y) => y % 2 === 0))

  expect(diopter.get(data)).toEqual([2, 4])
})

test('with guard > set', () => {
  const data = [1, 2, 3, 4]

  const diopter = d<typeof data>().map((x) => x.guard((y) => y % 2 === 0))

  expect(diopter.set(data, () => [4, 5])).toEqual([1, 4, 3, 5])
})

test('with guard > mod', () => {
  const data = [1, 2, 3, 4]

  const diopter = d<typeof data>().map((x) => x.guard((y) => y % 2 === 0))

  expect(diopter.set(data, (x) => x.map((y) => y * 10))).toEqual([1, 20, 3, 40])
})

test('over object values', () => {
  const data = { a: 1, b: 2, c: 3 }

  const diopter = d<typeof data>().map((x) => x)

  expect(diopter.get(data)).toEqual([1, 2, 3])
})
