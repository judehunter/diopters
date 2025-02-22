import { makeGuard } from './guard'

export const makeOpt = () => makeGuard((a) => a != null)
