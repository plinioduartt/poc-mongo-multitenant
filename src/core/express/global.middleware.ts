import { NextFunction, Request, Response } from "express";
import { assertDatabaseExists } from "~/adapters/orms/mongoose/configuration";
import { assertIsNotNullOrUndefined, assertIsValidTenantId } from "../assertions";
import jwt from 'jsonwebtoken'

export class GlobalMiddlewares {
  private secret: string | undefined

  constructor() {
    this.secret = process.env.JWT_SECRET
  }

  public async verifyJwt(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const bearerToken: string | string[] | undefined = request.headers['authorization']
      assertIsValidTenantId(bearerToken)
      assertIsNotNullOrUndefined(this.secret)
      if (!jwt.verify(bearerToken.replace('Bearer ', ''), this.secret)) {
        response.status(401).json({ message: 'Unauthorized' })
      } else {
        next()
      }
    } catch (error: unknown) {
      console.error(`Error on middleware.verifyJwt`, error)
      response.status(401).json({ message: 'Unauthorized' })
    }
  }

  public async verifyTenantByJwt(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId: string | string[] | undefined = request.headers['x-tenant-id']
      const bearerToken: string | string[] | undefined = request.headers['authorization']
      assertIsValidTenantId(bearerToken)
      assertIsNotNullOrUndefined(this.secret)
      const jwtPayload = jwt.verify(bearerToken.replace('Bearer ', ''), this.secret) as { tenantId: string }
      if (tenantId !== jwtPayload.tenantId) {
        response.status(401).json({ message: 'Invalid tenantId' })
      } else {
        next()
      }
    } catch (error: unknown) {
      console.error(`Error on middleware.verifyTenantByJwt`, error)
      response.status(401).json({ message: 'Invalid tenantId' })
    }
  }

  public async verifyTenantExistence(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId: string | string[] | undefined = request.headers['x-tenant-id']
      assertIsValidTenantId(tenantId)
      const databaseExists: boolean = await assertDatabaseExists(tenantId)
      if (!databaseExists) {
        response.status(401).json({ message: 'Invalid tenantId' })
      } else {
        next()
      }
    } catch (error: unknown) {
      console.error(`Error on middleware.verifyTenantExistence`, error)
      response.status(401).json({ message: 'Invalid tenantId' })
    }
  }
}
