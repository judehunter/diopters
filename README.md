# glyx
The declarative state management library. (*In the works*)

|`yarn add glyx`|`npm i glyx`|
|---|---|
```ts
const store = createStore(() => {
  const count = state(1)
  const expensive = derived(() => count.$ ** 10, [count])

  const increment = action(() => count.$ += 1)

  watch(() => {
    console.log(count.$)
  }, [count])

  return {count, expensive, increment}
})

store.increment()

store.getState() // {count: 2, expensive: 1024}
```

## TODO
- [x] Basic proof of concept
- [x] Subscribers / listeners (done: basic use case)
- [x] Watchers - passing previous and new value
- [ ] Comprehensive error handling, e.g. enforcing that the correct values are passed as dependencies. Includes TS support
- [ ] First-class TS support
- [ ] Exports for different frameworks, e.g. React, Vue, with specific APIs, like selectors
- [ ] Comparison functions
- [ ] Ready-to-use variants of declarations, like `action.set` to easily create a setter
- [ ] ...

## How to contribute
- Use `yarn test` to run tests