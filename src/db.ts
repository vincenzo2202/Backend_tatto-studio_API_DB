import "reflect-metadata"
import { DataSource } from "typeorm"
import { UsersTableMigration1698262021256 } from "./migration/1698262021256-users_table_migration"
import { RolesTableMigration1698262215631 } from "./migration/1698262215631-roles_table_migration"
import { RoleUserTableMigration1698262405828 } from "./migration/1698262405828-role_user_table_migration"
import { ClientsTableMigration1698263101535 } from "./migration/1698263101535-clients_table_migration"
import { WorkersTableMigration1698263348343 } from "./migration/1698263348343-workers_table_migration"
import { AppointmentsTableMigration1698263590602 } from "./migration/1698263590602-appointments_table_migration"
import { PortfolioTableMigration1698264002723 } from "./migration/1698264002723-portfolio_table_migration"
import { PortfolioWorkerTableMigration1698264078318 } from "./migration/1698264078318-portfolio_worker_table_migration"

export const AppDataSource = new DataSource({
 type: "mysql",
 host: "localhost",
 port: 3306,
 username: "root",
 password: "1234",
 database: "tattoo_studio_backend_db",
 entities: [],
 migrations:[UsersTableMigration1698262021256,RolesTableMigration1698262215631,RoleUserTableMigration1698262405828,ClientsTableMigration1698263101535,WorkersTableMigration1698263348343,AppointmentsTableMigration1698263590602,PortfolioTableMigration1698264002723,PortfolioWorkerTableMigration1698264078318],
 synchronize: false,
 logging: false,
})