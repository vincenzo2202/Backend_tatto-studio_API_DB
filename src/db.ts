import "reflect-metadata"
import { DataSource } from "typeorm"

import { Appointment } from "./models/Appointment"
import { Appointment_portfolio } from "./models/Appointment_portfolio"
import { Portfolio } from "./models/Portfolio"
import { Role } from "./models/Role"
import { User } from "./models/User"
import { RolesTableMigration1698496675919 } from "./migration/1698496675919-roles_table_migration"
import { UsersTableMigration1698496766134 } from "./migration/1698496766134-users_table_migration"
import { AppointmentsTableMigration1698496826651 } from "./migration/1698496826651-appointments_table_migration"
import { PortfolioTableMigration1698496868123 } from "./migration/1698496868123-portfolio_table_migration"
import { AppointmentPortfolioTableMigration1698496932444 } from "./migration/1698496932444-appointment_portfolio_table_migration"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST ,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Appointment, Appointment_portfolio, Portfolio, Role, User],
    migrations: [RolesTableMigration1698496675919, UsersTableMigration1698496766134, AppointmentsTableMigration1698496826651, PortfolioTableMigration1698496868123, AppointmentPortfolioTableMigration1698496932444
    ],
    synchronize: false,
    logging: false,
})