export function assertIsValidTenantId(tenantId: string | string[] | undefined): asserts tenantId is string {
  if (typeof tenantId !== 'string' || !tenantId?.trim()) {
    throw new Error("Invalid tenantId")
  }
}

export function assertIsNotNullOrUndefined<T>(value: T | undefined): asserts value is NonNullable<T> {
  if (!value) {
    throw new Error("Invalid parameter")
  }
}