import { Request } from "express";

export function GetTenant(request: Request): string {
  const tenantId: string = request.headers['x-tenant-id'] as string
  return tenantId
}