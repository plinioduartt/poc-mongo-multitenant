import { NextFunction, Request, Response } from 'express'
import { Context, ContextType } from '../context/context'
import { useTenantDatabase } from '~/adapters/orms/mongoose/configuration'

export async function loadTenantMiddleware(request: Request, _: Response, next: NextFunction): Promise<void> {
  return Context.run({}, async () => {
    const context: ContextType = Context.getStore() as ContextType
    context.tenantId = String(request.headers['x-tenant-id'] ?? '')
    context.connection = await useTenantDatabase(context.tenantId)
    next()
  })
}
