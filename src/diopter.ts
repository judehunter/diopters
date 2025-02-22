import { std } from './std/std'
import { Paths } from './std/paths'
import { Std } from './std/std'

export type Diopter<A, B, isPrism extends boolean = false> = {
  get(a: A): NoInfer<isPrism> extends true ? B | undefined : B
  set(a: A, modFn: (b: B) => B): A
  isPrism: isPrism
  print: () => string
} & Std<A, B, isPrism> &
  Paths<A, B, isPrism>

export const diopter = <A, B, isPrism extends boolean = false>({
  get,
  set,
  isPrism,
  debug,
}: {
  get: (a: A) => B
  set: (a: A, modFn: (b: B) => B) => A
  isPrism?: isPrism
  debug?: string
}): Diopter<A, B, isPrism> => {
  const thisLens = {
    get,
    set,
    isPrism: isPrism ?? false,
    print: () => {
      return debug ?? '<?>'
    },
  }

  return std(thisLens as any) as any
}
