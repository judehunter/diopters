import { test, expect, vi, describe } from 'vitest'
import { d } from '../src'

describe('identity', () => {
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
})

describe('path', () => {
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
})

describe('guard', () => {
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
})

describe('map', () => {
  test('not a prism', () => {
    const data = [{ a: 1 }, { a: 2 }, { a: 3 }] as { a: number }[]

    const diopter = d<typeof data>().map((x) => x)

    expect(diopter.isPrism).toBe(false)
  })

  test('fails on data non-array', () => {
    const data = 1 as any as number[]

    const diopter = d<typeof data>().map((x) => x)

    expect(() => diopter.get(data)).toThrow('Not an array')
    expect(() => diopter.set(data, () => [1, 2, 3])).toThrow('Not an array')
    expect(() => diopter.set(data, (x) => x.map((y) => y * 2))).toThrow(
      'Not an array',
    )
  })

  test('fails on modified non-array', () => {
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

  test('set fails on array length mismatch', () => {
    const data = [1, 2, 3]

    const diopter = d<typeof data>().map((x) => x)

    expect(() => diopter.set(data, () => [4, 5])).toThrow()
    expect(() => diopter.set(data, () => [4, 5, 6, 7])).toThrow()
  })

  test('set fails on array length mismatch (with undefs)', () => {
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

    expect(
      diopter.set(data, (x) => x.map((y) => y.map((z) => z * 10))),
    ).toEqual([
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

  test.skip('undefined elements > nested')

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

    expect(diopter.set(data, (x) => x.map((y) => y * 10))).toEqual([
      1, 20, 3, 40,
    ])
  })
})

describe('flatOnce', () => {
  test('2d matrix > get', () => {
    const data = [
      [1, 2],
      [3, 4],
      [5, 6],
    ]

    const diopter = d<typeof data>().flatOnce()

    expect(diopter.get(data)).toEqual([1, 2, 3, 4, 5, 6])
  })

  test('2d matrix > set', () => {
    const data = [
      [1, 2],
      [3, 4],
      [5, 6],
    ]

    const diopter = d<typeof data>().flatOnce()

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

    const diopter = d<typeof data>().flatOnce()

    expect(diopter.set(data, (x) => x.map((y) => y * 10))).toEqual([
      [10, 20],
      [30, 40],
      [50, 60],
    ])
  })

  test('2d array with uneven lengths > get', () => {
    const data = [[1], [2, 3, 4], [5, 6]]

    const diopter = d<typeof data>().flatOnce()

    expect(diopter.get(data)).toEqual([1, 2, 3, 4, 5, 6])
  })

  test('2d array with uneven lengths > set', () => {
    const data = [[1], [2, 3, 4], [5, 6]]

    const diopter = d<typeof data>().flatOnce()

    expect(diopter.set(data, () => [7, 8, 9, 10, 11, 12])).toEqual([
      [7],
      [8, 9, 10],
      [11, 12],
    ])
  })

  test('2d array with uneven lengths > mod', () => {
    const data = [[1], [2, 3, 4], [5, 6]]

    const diopter = d<typeof data>().flatOnce()

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

    const diopter = d<typeof data>().flatOnce().flatOnce()

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

    const diopter = d<typeof data>().flatOnce().flatOnce()

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

    const diopter = d<typeof data>().flatOnce().flatOnce()

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
      .map((x) =>
        x.a.map((y) => y.guard((z): z is { b: number } => 'b' in z).b),
      )
      .flatOnce()

    expect(diopter.get(data)).toEqual([1, 2, 4, 5])
  })

  test('complex > set', () => {
    const data = [
      { a: [{ b: 1 }, { b: 2 }] },
      { a: [{ c: 3 }, { b: 4 }] },
      { a: [{ b: 5 }, { c: 6 }] },
    ]

    const diopter = d<typeof data>()
      .map((x) =>
        x.a.map((y) => y.guard((z): z is { b: number } => 'b' in z).b),
      )
      .flatOnce()

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
      .map((x) =>
        x.a.map((y) => y.guard((z): z is { b: number } => 'b' in z).b),
      )
      .flatOnce()

    expect(diopter.set(data, (x) => x.map((y) => y * 10))).toEqual([
      { a: [{ b: 10 }, { b: 20 }] },
      { a: [{ c: 3 }, { b: 40 }] },
      { a: [{ b: 50 }, { c: 6 }] },
    ])
  })

  test('fails on data non-array', () => {
    const data = 1 as any

    const diopter = d<typeof data>().flatOnce()

    expect(() => diopter.get(data)).toThrow('Not an array')
    expect(() => diopter.set(data, () => [1, 2])).toThrow('Not an array')
    expect(() => diopter.set(data, (x) => x.map((y) => y * 10))).toThrow(
      'Not an array',
    )
  })

  test('fails on data non-2d array', () => {
    const data = [1, 2, 3] as any

    const diopter = d<typeof data>().flatOnce()

    expect(() => diopter.get(data)).toThrow('Not a 2d array')
    expect(() => diopter.set(data, () => [1, 2])).toThrow('Not a 2d array')
    expect(() => diopter.set(data, (x) => x.map((y) => y * 10))).toThrow(
      'Not a 2d array',
    )
  })

  test('fails on array length mismatch', () => {
    const data = [
      [1, 2],
      [3, 4, 5],
    ]

    const diopter = d<typeof data>().flatOnce()

    expect(() => diopter.set(data, () => [1, 2])).toThrow(
      'Modified array length mismatch',
    )
  })
})

describe('pick', () => {
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

  test('fails on data non-object', () => {
    const data = null as any

    const diopter = d<typeof data>().pick(['a', 'b'])

    expect(() => diopter.get(data)).toThrow('Not an object')
    expect(() => diopter.set(data, () => ({ a: 4, b: 5 }))).toThrow(
      'Not an object',
    )
    expect(() => diopter.set(data, (x) => x)).toThrow('Not an object')
  })

  test('fails on modified non-object', () => {
    const data = { a: 1, b: 2 }

    const diopter = d<typeof data>().pick(['a', 'b'])

    expect(() => diopter.set(data, () => 1 as any)).toThrow(
      'Modified value is not an object',
    )
    expect(() => diopter.set(data, (x) => 1 as any)).toThrow(
      'Modified value is not an object',
    )
  })

  test('fails on additional modified keys', () => {
    const data = { a: 1, b: 2 }

    const diopter = d<typeof data>().pick(['a', 'b'])

    expect(() => diopter.set(data, () => ({ a: 4, c: 5 }) as any)).toThrow(
      'Modified value has unexpected key: c',
    )
  })

  test('fails on missing modified keys', () => {
    const data = { a: 1, b: 2 }

    const diopter = d<typeof data>().pick(['a', 'b'])

    expect(() => diopter.set(data, () => ({ a: 4 }) as any)).toThrow(
      'Modified value does not specify all keys',
    )
  })
})
