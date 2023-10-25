import "reflect-metadata"
import { DataSource } from "typeorm"
import { UsersTableMigration1698262021256 } from "./migration/1698262021256-users_table_migration"

export const AppDataSource = new DataSource({
 type: "mysql",
 host: "localhost",
 port: 3306,
 username: "root",
 password: "1234",
 database: "tattoo_studio_backend_db",
 entities: [],
 migrations:[UsersTableMigration1698262021256],
 synchronize: false,
 logging: false,
})