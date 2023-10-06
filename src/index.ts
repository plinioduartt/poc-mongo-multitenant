import dotenv from 'dotenv'
import { UsersController } from './adapters/input/users.controller'
import { startConnection } from './adapters/orms/mongoose/configuration'
import { Server } from './core/express/server.configuration'
import { AuthenticationController } from './adapters/input/authentication.controller'

dotenv.config()
const server = new Server()

async function start(): Promise<void> {
  try {
    server.initialize()
    server.registerPublicRoutes([
      { path: '/api/v1/authentication', handler: new AuthenticationController().router }
    ])
    server.registerPrivateRoutes([
      { path: '/api/v1/users', handler: new UsersController().router }
    ])
    await startConnection()
    server.listen()
  } catch (error: unknown) {
    console.error('Erro ao iniciar servidor', error)
  }
}

start()

