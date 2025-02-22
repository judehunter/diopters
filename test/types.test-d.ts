import { expectTypeOf, test } from 'vitest'
import { d } from '../src'

test('object path', () => {
  type Data = { a: { b: { c: string } } }

  const value = d<Data>().a.b.c.get(null!)

  expectTypeOf(value).toEqualTypeOf<string>()
})

test('array path', () => {
  type Data = number[][][]

  const value = d<Data>()[0][1][2].get(null!)

  expectTypeOf(value).toEqualTypeOf<number>()
})

test('tuple path', () => {
  type Data = [number, [number, string]]

  const value = d<Data>()[1][1].get(null!)

  expectTypeOf(value).toEqualTypeOf<string>()
})

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
