import mongoose from "mongoose";
import Tenant from "./schemas/tenant.schema";
import User from "./schemas/user.schema";

async function startConnection(): Promise<void> {
  try {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    const tenantSize = 5
    const options: mongoose.ConnectOptions = {
      maxPoolSize: tenantSize,
    }
    await mongoose.connect(uri, options)
  } catch (error) {
    console.error("Erro ao iniciar conexão com mongodb", error)
    throw error
  }
}

async function assertDatabaseExists(database: string): Promise<boolean> {
  const admin = mongoose.connection.getClient().db().admin();
  const dbInfo = await admin.listDatabases();
  if (!dbInfo.databases.find(db => db.name === database)) {
    return false
  }
  return true
}

const SchemasByDatabase = new Map()
  .set('admin', [
    { key: "tenants", value: Tenant }
  ])
  .set('tenant', [
    { key: "users", value: User }
  ])

async function useAdminDatabase(): Promise<mongoose.Connection> {
  const database = 'configurations'
  const connected = 1

  try {
    if (mongoose.connection.readyState === connected) {
      const db = mongoose.connection.useDb(database, { useCache: true })
      // Prevent from schema re-registration
      if (!Object.keys(db.models).length) {
        SchemasByDatabase.get('admin')?.forEach((schema: { key: string, value: mongoose.Schema }) => {
          db.model(schema.key, schema.value)
        });
      }
      return db
    }
    throw new Error("Conexão não estabelecida")
  } catch (error) {
    console.error(`Erro ao conectar no banco ${database}`, error)
    throw error
  }
}

async function useTenantDatabase(tenantId: string): Promise<mongoose.Connection> {
  const connected = 1
  const database = tenantId
  try {
    if (mongoose.connection.readyState === connected) {
      const databaseExists: boolean = await assertDatabaseExists(database)
      if (!databaseExists) {
        throw new Error("Invalid tenantId")
      }

      const db = mongoose.connection.useDb(database, { useCache: true })
      // Prevent from schema re-registration
      if (!Object.keys(db.models).length) {
        SchemasByDatabase.get('tenant')?.forEach((schema: { key: string, value: mongoose.Schema }) => {
          db.model(schema.key, schema.value)
        });
      }
      return db
    }
    throw new Error("Conexão não estabelecida")
  } catch (error) {
    console.error(`Erro ao conectar no banco ${database}`, error)
    throw error
  }
}

export { startConnection, useTenantDatabase, useAdminDatabase, assertDatabaseExists }