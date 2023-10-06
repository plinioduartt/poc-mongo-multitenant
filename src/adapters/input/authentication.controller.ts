import { Request, Response, Router } from "express";
import jwt from 'jsonwebtoken';
import { Connection } from "mongoose";
import { assertIsNotNullOrUndefined } from "../../core/assertions";
import { GetTenant } from "../../core/get-tenant";
import { useTenantDatabase } from "../orms/mongoose/configuration";
import User from '../orms/mongoose/schemas/user.schema';

export class AuthenticationController {
  public router = Router()
  private secret: string | undefined

  constructor() {
    this.router.post('/signin', this.signIn.bind(this))
    this.secret = process.env.JWT_SECRET
  }

  public async signIn(request: Request, response: Response): Promise<Response> {
    assertIsNotNullOrUndefined(this.secret)
    const tenantId: string = GetTenant(request)
    const { username, password } = request.body

    const database: Connection = await useTenantDatabase(tenantId)
    const model = database.model<typeof User>('users')
    const user = await model.findOne({ username })

    if (!user) {
      return response.status(401).json({ message: "Invalid username or password" })
    }
    if (password !== user.password) {
      return response.status(401).json({ message: "Invalid username or password" })
    }

    const accessToken = jwt.sign({ username, tenantId }, this.secret, { expiresIn: '6h' })
    return response.json({ accessToken })
  }
}