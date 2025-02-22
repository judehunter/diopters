export type NonUndef<T> = T & ({} | null)

export type KeyOfDistr<T> = T extends any ? keyof T : never

export type AccessDistr<T, K extends KeyOfDistr<T>> =
  T extends Record<K, any> ? T[K] : never
export type ValueOf<T> = T extends any[]
  ? T[number]
  : T extends Record<any, any>
    ? T[keyof T]
    : never
