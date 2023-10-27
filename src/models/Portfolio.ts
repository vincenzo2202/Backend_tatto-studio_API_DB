import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm" 
import { Appointment } from "./Appointment"

@Entity("portfolio")
export class Portfolio extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    category!: string

    @Column()
    image!: string

    @Column()
    price!: number

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date

    @ManyToMany(() => Appointment)
    @JoinTable({
        name: "appointment_portfolio",
        joinColumn: {
            name: "portfolio_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "appointment_id",
            referencedColumnName: "id"
        }
    })
    portfolioAppointments!: Appointment[]

}
