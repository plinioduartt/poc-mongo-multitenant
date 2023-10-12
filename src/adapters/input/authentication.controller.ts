import { Request, Response, Router } from "express";
import jwt from 'jsonwebtoken';
import { Connection } from "mongoose";
import { assertIsNotNullOrUndefined } from "~/core/assertions";
import { useTenantDatabase } from "../orms/mongoose/configuration";
import User from '../orms/mongoose/schemas/user.schema';
import { Context, ContextType } from "~/core/context/context";

export class AuthenticationController {
  public readonly router = Router()
  private secret: string | undefined

  constructor() {
    this.router.post('/sign-in', this.signIn.bind(this))
    this.secret = process.env.JWT_SECRET
  }

  public async signIn(request: Request, response: Response): Promise<Response> {
    assertIsNotNullOrUndefined(this.secret)
    const { username, password } = request.body

    const {tenantId, connection: database}: ContextType = Context.getStore() ?? {}
    
    const model = database?.model<typeof User>('users')
    const user = await model?.findOne({ username })

    if (!user || password !== user.password) {
      return response.status(401).json({ message: "Invalid username or password" })
    }

    const accessToken = jwt.sign({ username, tenantId }, this.secret, { expiresIn: '6h' })
    return response.json({ accessToken })
  }
}