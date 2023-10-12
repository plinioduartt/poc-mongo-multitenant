import cors from 'cors'
import express from 'express'
import { GlobalMiddlewares } from './global.middleware'
import { loadTenantMiddleware } from './tenant.middleware'

export class Server {
  private app = express()
  private globalMiddlewares = new GlobalMiddlewares()

  public initialize(): void {
    this.app.use(cors())
    this.app.use(express.json())
  }

  public listen(): void {
    this.app.listen(3000, () => console.log('Servidor iniciado na porta 3000'))
  }

  public registerPublicRoutes(routes: Array<Record<string, any>>): void {
    for (const route of routes) {
      this.app.use(
        route.path,
        [
          this.globalMiddlewares.verifyTenantExistence.bind(this.globalMiddlewares),
          loadTenantMiddleware
        ],
        route.handler
      )
    }
  }

  public registerPrivateRoutes(routes: Array<Record<string, any>>): void {
    for (const route of routes) {
      this.app.use(
        route.path,
        [
          this.globalMiddlewares.verifyJwt.bind(this.globalMiddlewares),
          this.globalMiddlewares.verifyTenantByJwt.bind(this.globalMiddlewares),
          this.globalMiddlewares.verifyTenantExistence.bind(this.globalMiddlewares),
          loadTenantMiddleware
        ],
        route.handler
      )
    }
  }
}
