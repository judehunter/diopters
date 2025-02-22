import { ArrayElem, ObjElem, ValueOf } from '../utils'
import { NonUndef } from '../utils'
import { diopter, Diopter } from '../diopter'
import { composeDiopters } from '../composeDiopters'
import { d } from '../d'
import { paths } from './paths'
import { makeGuard } from './guard'
import { makeMap } from './map'
import { makeFlat } from './flat'
import { makeOpt } from './opt'
import { makePick } from './pick'

export type Std<A, B, isAbPrism extends boolean> = {
  /**
   * `compose()` takes a diopter and returns a new diopter that
   * is the composition of the two diopters.
   *
   * This is useful for chaining diopters together,
   * including your custom diopters.
   */
  compose<C, isBcPrism extends boolean>(
    bc: Diopter<NoInfer<B>, C, isBcPrism>,
  ): Diopter<
    A,
    C,
    isAbPrism extends true ? true : isBcPrism extends true ? true : false
  >

  /**
   * `opt()` is just a `guard()` with a predicate that excludes `undefined`
   */
  opt(): Diopter<A, NonUndef<B>, true>

  /**
   * `guard()` takes a predicate and returns a new composed diopter that
   * only focuses on values that match the predicate.
   *
   * This is useful for type narrowing of union types.
   */
  guard<X extends B>(
    predicate: ((b: B) => b is X) | ((b: B) => boolean),
  ): Diopter<A, X, true>

  /**
   * `values()` focuses on the values of an object.
   */
  values(): Diopter<A, ObjElem<B>, true>

  /**
   * `map()` applies a diopter given by `mapFn` to each element of the array.
   */
  map<C>(
    mapFn: (
      valueOfA: Diopter<ArrayElem<B>, ArrayElem<B>>,
    ) => Diopter<ArrayElem<B>, C, true> | Diopter<ArrayElem<B>, C, false>,
  ): B extends any[] ? Diopter<A, C[]> : never

  /**
   * `filter()` returns a sub-array of elements that match the predicate.
   * Equivalent of running `map()` with a `guard()` inside.
   */
  // filter<C extends B>(predicate: (b: B) => b is C): Diopter<A[], C[]>

  /**
   * `pick()` focuses on a subset of keys from the object.
   */
  pick<PickedKeys extends keyof B>(
    keys: PickedKeys[],
  ): Diopter<A, Pick<B, PickedKeys>>

  /**
   * `flat()` turns a 2d array into a 1d array.
   * Apply multiple times to flatten more levels.
   */
  flat(): B extends any[][] ? Diopter<A, B[number]> : never
}

export const std = <A, B, isAbPrism extends boolean>(
  ab: Diopter<A, B, isAbPrism>,
) => {
  const compose: Std<A, B, isAbPrism>['compose'] = (bc) =>
    composeDiopters(ab, bc)

  const opt: Std<A, B, isAbPrism>['opt'] = () =>
    compose(makeOpt() as any) as any

  const guard: Std<A, B, isAbPrism>['guard'] = (predicate) =>
    compose(makeGuard(predicate) as any) as any

  const map: Std<A, B, isAbPrism>['map'] = (mapFn) =>
    compose(makeMap(mapFn) as any) as any

  const pick: Std<A, B, isAbPrism>['pick'] = (keys) =>
    compose(makePick(keys as any) as any) as any

  const flat: Std<A, B, isAbPrism>['flat'] = () =>
    compose(makeFlat() as any) as any

  const target = {
    ...ab,
    compose,
    opt,
    guard,
    map,
    pick,
    flat,
  }

  return paths(target, compose)
}
