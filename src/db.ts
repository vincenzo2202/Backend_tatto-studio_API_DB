import "reflect-metadata"
import { DataSource } from "typeorm"
import { UsersTableMigration1698262021256 } from "./migration/1698262021256-users_table_migration"
import { RolesTableMigration1698262215631 } from "./migration/1698262215631-roles_table_migration"
import { RoleUserTableMigration1698262405828 } from "./migration/1698262405828-role_user_table_migration"
import { AppointmentsTableMigration1698263590602 } from "./migration/1698263590602-appointments_table_migration"
import { PortfolioTableMigration1698264002723 } from "./migration/1698264002723-portfolio_table_migration" 

import { Appointment } from "./models/Appointment"
import { Appointment_portfolio} from "./models/Appointment_portfolio"
import { Portfolio } from "./models/Portfolio"
import { Role } from "./models/Role"
import { Role_user } from "./models/Role_user"
import { User } from "./models/User" 
import { AppointmentPortfolio1698416412420 } from "./migration/1698416412420-appointment_portfolio"

export const AppDataSource = new DataSource({
 type: "mysql",
 host: "localhost",
 port: 3306,
 username: "root",
 password: "1234",
 database: "tattoo_studio_backend_db",
 entities: [Appointment,Appointment_portfolio, Portfolio, Role_user,Role, User],
 migrations:[UsersTableMigration1698262021256,RolesTableMigration1698262215631,RoleUserTableMigration1698262405828,AppointmentsTableMigration1698263590602,PortfolioTableMigration1698264002723,AppointmentPortfolio1698416412420],
 synchronize: false,
 logging: false,
})