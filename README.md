# 🔎 Diopters

Dead-simple, TypeScript-first optics library. Optics are a way to drill into complex data structures and read or modify nested data.

😌 **Simple concepts**. Only one optic type, `Diopter` - acts as a lens, prism, and traversal.

🌊 **Fluent API**. Define optics just as you would access nested data. Get a setter for free.

🤏 **Tiny**. 1kB minified and brotlied. No dependencies.

🧠 **TypeScript-first**. Fully type safe optic composition.

🔋 **Batteries included**. Ships with common optics, like `path`, `map`, `guard`, and more.

🔧 **Well tested**. 140 comprehensive tests, 100% coverage. Any issues will be swiftly addressed.

```ts
type User = { accounts?: Account[] }
type Account = { money: number}

const userToMoney = d<User>()
  .accounts // access path
  .opt() // short-circuit if undefined (like `?.`)
  .map(account => account.money) // apply callback optic to each array element

typeof userToMoney
// ^? Diopter<From: User, To: number[], IsPrism: true>

const user = { accounts: [{ money: 10 }, { money: 20 }] }

// Make it rain!
const luckyUser = userToMoney.set(user, list => list.map(x => x * 5))
userToMoney.get(luckyUser) // [50, 100]

// Short-circuiting
userToMoney.get({}) // undefined
```

## Install

```bash
npm i diopters
```

## Documentation

All you need is to read the rest of this README.md 😄

## Anatomy of a Diopter

In essence, a `Diopter` is a:

- Lens – it specifies how to get from one data type to another.

- Prism – it can optionally short-circuit if the data is not what you're looking for. Akin to the `?.` operator, but for arbitrary conditions.

- Traversal – you can apply optics over collection elements with `.map()`. The result is just a Diopter that focuses on the mapped collection.

A `Diopter` has the following signature:

```ts
type Diopter<From, To, IsPrism = false>
```

## Creating custom Diopters

```ts
const firstElementDiopter = <T extends any[]>() =>
  diopter<T, T[0]>({
    get: list => list[0],
    set: (list, modFn) => [modFn(list[0]), ...list.slice(1)]
  })

const list = [{ foo: 1 }, { foo: 2 }]

// compose with other diopters (or use directly)
const firstElementFoo = d<typeof list>()
  .compose(firstElementDiopter())
  .foo

firstElementFoo.get(list) // 1
firstElementFoo.set(list, 3) // [{ foo: 3 }, { foo: 2 }]
```

## Built-in Diopters

The Diopters API is designed to look like the syntax you'd use to access nested data. This means you can traverse objects with the `.` dot-access syntax, as well as use many familiar methods, such as `.map()`, `flat()`, `opt()` (the `?.` operator).

Below, a reference of all built-in Diopters.

### d (identity)

This is how you start your diopter composition chain. The `d` identity function creates a no-op diopter that lets you specify the `From` type (your original data type before the optic is applied).

```ts
type Data = { a: { b: { c: number } } }
const example = d<Data>()
// ^? Diopter<From: Data, To: Data>

const more = example.a.b.c
// ^? Diopter<From: Data, To: number>
```

### path

Allows you to access an object property by key, or a tuple/array element by index, with full type safety.

Objects:

```ts
type Data = { a: number }
const example = d<Data>().a
// Diopter<From: Data, To: number>

example.get( ... )
// ^? number
example.get({ a: 1 }) // 1

example.set( ... )
// ^? Data
example.set({ a: 1 }, () => 2) // { a: 2 }
```

Tuples:

```ts
type Data = [number, string]
const example = d<Data>()[1]
// Diopter<From: Data, To: string>

example.get( ... )
// ^? string
example.get([1, 'a']) // 'a'

example.set( ... )
// ^? Data
example.set([1, 'a'], () => 'b') // [1, 'b']
```

Arrays:

```ts
type Data = (number | string)[]
const example = d<Data>()[1]
// Diopter<From: Data, To: number | string>

example.get( ... )
// ^? number | string
example.get([1, 'a', 2]) // 'a'

example.set( ... )
// ^? Data
example.set([1, 'a', 2], () => 'b') // [1, 'b', 2]
```

### opt

Stops drilling (short-circuits) into the data structure immediately if the current value is `undefined` or `null`.

This is equivalent to the `?.` operator.

```ts
type Data = { a: { b: number } | undefined }
const example = d<Data>()
  .a
  .opt()
  .b
// ^? Diopter<From: Data, To: number, isPrism: true>

example.get( ... )
// ^? number | undefined
example.get({ a: { b: 1 } }) // 1
example.get({ a: undefined }) // undefined

example.set( ... )
// ^? Data
example.set({ a: { b: 1 } }, () => 2) // { a: { b: 2 } }
// only sets if the value is defined
example.set({ a: undefined }, () => 2) // { a: undefined }
```

`.opt()` is just a short-hand for a [guard](#guard) with a non-null check:

```ts
d<Data>()
  .guard( (x): x is NonNullable<typeof x> => x != null )
```

### guard

Allows you to specify a custom guard function.

If the guard predicate returns `false`, the Diopter will short-circuit.
- When getting, `undefined` will be returned.
- When setting, the original data will be returned unchanged.

This can be useful, for instance, when only trying to focus on one subtype of a union type (or whatever other condition you want to check).

The guard function can be a
- [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) – it will narrow the type of the data.
```ts
type Data = number | string
const example = d<Data>()
  .guard(x => typeof x === 'number') // automatic type guard
// ^? Diopter<From: number | string, To: number, isPrism: true>

example.get( ... )
// ^? number | undefined
example.get(1) // 1
example.get('a')

example.set( ... )
// ^? Data
example.set(1, () => 2) // 2
// only sets if the guard passes
example.set('a', () => 2) // 'a'
```
- just a function that returns a boolean - no type narrowing will occur.
```ts
type Data = number
const example = d<Data>()
  .guard(x => x > 10)
// ^? Diopter<From: number, To: number, isPrism: true>

example.get( ... )
// ^? number | undefined
example.get(20) // 20
example.get(1) // undefined

example.set( ... )
// ^? Data
example.set(20, x => x * 2) // 40
// only sets if the guard passes
example.set(1, () => 2) // 1
```

### map

Applies a Diopter to each element of an array, and then focuses on the result.

Note that when setting, this means you need to return a new modified array, typically by mapping over the given array. In other words, the setter function will only be called once with the focused array, not once per element.

```ts
type Data = { a: number }[]
const foo = d<Data>()
  .map(x => x.a)
// ^? Diopter<From: Data, To: number[]>

foo.get( ... )
// ^? number[]
foo.get([{ a: 1 }, { a: 2 }]) // [1, 2]

foo.set( ... )
// ^? Data
foo.set(
  [{ a: 1 }, { a: 2 }],
  list => list.map(x => x * 10)
) // [{ a: 10 }, { a: 20 }]
```

If the mapping function returns a Diopter in prism mode (e.g. when using `opt()` or `guard()`), then missing (`undefined`) elements are skipped from the focused array. This means that you can combine `map` with `guard` to achieve a `filter` Diopter.

```ts
type Data = { a: number | undefined }[]
const foo = d<Data>()
  .map(x => x.a.opt())
// ^? Diopter<From: Data, To: number[]>

foo.get( ... )
// ^? number[]
foo.get([{ a: 1 }, { a: undefined }, { a: 3 }]) // [1, 3]

foo.set( ... )
// ^? Data
foo.set(
  [{ a: 1 }, { a: undefined }, { a: 3 }],
  // the type of `list` is `number[]`, and NOT `(number | undefined)[]`
  list => list.map(x => x * 10)
) // [{ a: 10 }, { a: undefined }, { a: 30 }]
```

You can nest any Diopters, including `.map()` itself withing the `.map()` callback.
```ts
type Data = { a: { b: number }[] }[]
const example = d<Data>()
  .map(x => x.a.map(y => y.b))
// ^? Diopter<From: Data, To: number[][]>

example.get( ... )
// ^? number[][]
example.get([{ a: [{ b: 1 }, { b: 2 }] }, { a: [{ b: 3 }, { b: 4 }] }]) // [[1, 2], [3, 4]]

example.set( ... )
// ^? Data
example.set(
  [{ a: [{ b: 1 }, { b: 2 }] }, { a: [{ b: 3 }, { b: 4 }] }],
  list => list.map(x => x.map(y => y * 10))
) // [{ a: [{ b: 10 }, { b: 20 }] }, { a: [{ b: 30 }, { b: 40 }] }]
```

You might notice that modifying this nested focused array is a bit cumbersome, since we need to map over multiple array dimensions. This is where the `flat()` method comes in.

### flat

Focuses on an array that is created as a result of flattening a 2d array into a 1d array.

This is very useful when focusing on nested arrays, in scenarios where you only care about the final list of elements, and not the structure of the nested arrays.

Note that arbitrary-depth flattening is not supported. This method always flattens one level deep. To flatten more levels, call `flat()` multiple times.

```ts
type Data = number[][]
const example = d<Data>()
  .flat()
// ^? Diopter<From: Data, To: number[]>

example.get( ... )
// ^? number[]
example.get([[1, 2], [3, 4]]) // [1, 2, 3, 4]

example.set( ... )
// ^? Data
example.set([[1, 2], [3, 4]], list => list.map(x => x * 10)) // [[10, 20], [30, 40]]
```

### pick

Focuses on a subobject of an object, given by an array of keys. It's a useful way to avoid the spread syntax when setting.

```ts
type Data = { a: number, b: number, c: number }
const example = d<Data>().pick(['a', 'b'])
// ^? Diopter<From: Data, To: { a: number, b: number }>

example.get( ... )
// ^? { a: number, b: number }
example.get({ a: 1, b: 2, c: 3 }) // { a: 1, b: 2 }

example.set( ... )
// ^? Data
// notice no spread syntax, since we're only setting the picked properties
example.set({ a: 1, b: 2, c: 3 }, x => ({ a: x * 10, b: x * 10 })) // { a: 10, b: 20, c: 3 }
```

## Misc

### No polymorphism

Note that currently, diopters are not polymorphic. This means that modifying the data using `.set` will not change the returned data type - it will always be the `From` type.

## License

MIT
