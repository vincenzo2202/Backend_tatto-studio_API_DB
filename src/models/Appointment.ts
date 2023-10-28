import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { Portfolio } from "./Portfolio";

@Entity("appointments")
export class Appointment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "date" })
    date!: string; 

    @Column({ type: "time" })
    time!: string;

    @Column()
    status!: boolean

    @Column()
    worker_id!: number

    @Column()
    client_id!: number

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date


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
    appointmentPortfolios!: Portfolio[]
}
