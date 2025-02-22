export type NonUndef<T> = T & ({} | null)

export type Keys<T> = [T] extends readonly [infer R extends any[]]
  ? [number] extends [R['length']]
    ? number
    : Exclude<keyof R, keyof any[]>
  : [T] extends [object]
    ? keyof T
    : never

export type KeysDistr<T> = T extends any ? Keys<T> : never

export type AccessDistr<T, K extends KeysDistr<T>> =
  T extends Record<K, any> ? T[K] : never

export type ValueOf<T> = T extends any[]
  ? T[number]
  : T extends Record<any, any>
    ? T[keyof T]
    : never

export type ArrayElem<T> = T extends any[] ? T[number] : never

export type ObjElem<T> = T extends Record<any, any> ? T[keyof T] : never

export type RemoveNevers<T extends Record<string, any>> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}

export type ObjEntry<T> = [KeysDistr<T>, ValueOf<T>]

export type Simplify<T> = {
  [K in keyof T]: T[K]
} & {}
