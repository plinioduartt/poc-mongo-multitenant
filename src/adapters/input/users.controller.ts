import { Request, Response, Router } from "express";
import { Connection } from "mongoose";
import { GetTenant } from "../../core/get-tenant";
import { useTenantDatabase } from "../orms/mongoose/configuration";
import User from "../orms/mongoose/schemas/user.schema";

export class UsersController {
  public router = Router()

  constructor() {
    this.router.get('/', this.list.bind(this))
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const tenantId: string = GetTenant(request)
    const database: Connection = await useTenantDatabase(tenantId)
    const model = database.model<typeof User>('users')
    const users = await model.find({})
    return response.json({ users })
  }
}