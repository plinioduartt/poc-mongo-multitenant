import { AsyncLocalStorage } from 'async_hooks'
import { Connection } from 'mongoose'

export type ContextType = {
  tenantId?: string
  correlationId?: string,
  connection?: Connection
}

const Context: AsyncLocalStorage<ContextType> = new AsyncLocalStorage()

export { Context }
