import { expectTypeOf, test } from 'vitest'
import { d } from '../src'

test('optional path', () => {
  type Data = { a: { b: { c: string } | undefined } }

  const value = d<Data>().a.b.opt().get(null!)

  expectTypeOf(value).toEqualTypeOf<{ c: string } | undefined>()
})

test('guard', () => {
  type Data = number | string

  const value = d<Data>()
    .guard((x) => typeof x === 'number')
    .get(null!)

  expectTypeOf(value).toEqualTypeOf<number | undefined>()
})
