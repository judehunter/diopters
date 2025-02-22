import { Diopter, diopter } from './diopter'

export const d = <A>(): Diopter<A, A> =>
  diopter({
    get: (a: A) => a,
    set: (a, modFn) => modFn(a),
    debug: 'id',
  })
