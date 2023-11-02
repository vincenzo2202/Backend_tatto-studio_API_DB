import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm" 
import { Appointment } from "./Appointment"
import { Appointment_portfolio } from "./Appointment_portfolio"

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


    @OneToMany(() => Appointment_portfolio, (appointment_portfolios) => appointment_portfolios.portfolio)
    appointment_portfolios!: Appointment_portfolio[];
 

}
