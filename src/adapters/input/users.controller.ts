import { Request, Response, Router } from "express";
import { Connection } from "mongoose";
import { Context } from "~/core/context/context";
import User from "../orms/mongoose/schemas/user.schema";

export class UsersController {
  public router = Router()

  constructor() {
    this.router.get('/', this.list.bind(this))
  }

  public async list(_: Request, response: Response): Promise<Response> {
    const database: Connection| undefined = Context.getStore()?.connection
    const model = database?.model<typeof User>('users')
    const users = await model?.find({})
    return response.json({ users })
  }
}