import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { Portfolio } from "./Portfolio";
import { Appointment_portfolio } from "./Appointment_portfolio";
import { userRoutes } from "../routes/usersRoutes";
import { User } from "./User";

@Entity("appointments")
export class Appointment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "date" })
    date!: string; 

    @Column()
    shift!: string;

    @Column()
    status!: boolean

    @Column()
    worker_id!: number

    @Column()
    client_id!: number

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at!: Date;


    @ManyToMany(() => Portfolio)
    @JoinTable({
        name: "appointment_portfolio",
        joinColumn: {
            name: "appointment_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "portfolio_id",
            referencedColumnName: "id"
        }
    })
    appointmentPortfolios!: Portfolio[];


    @OneToMany(() => Appointment_portfolio, (Appointment_portfolio) => Appointment_portfolio.appointment)
    appointment_portfolios!: Appointment_portfolio[];

    @ManyToOne(() => User, (user) => user.clientAppointments)
    @JoinColumn ({name: "client_id"})
    client!: User; 

    @ManyToOne(() => User, (user) => user.workerAppointments)
    @JoinColumn ({name: "worker_id"})
    worker!: User; 
  

}
