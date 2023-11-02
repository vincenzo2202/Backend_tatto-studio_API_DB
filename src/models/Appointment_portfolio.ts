import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Appointment } from "./Appointment"
import { Portfolio } from "./Portfolio"

@Entity("appointment_portfolio")
export class Appointment_portfolio extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
  
    @Column()
    portfolio_id!: number

    @Column()
    appointment_id!: number
    
    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date

    @ManyToOne(() => Appointment, (appointment) => appointment.appointment_portfolios)
    @JoinColumn({ name: "appointment_id" })  
    appointment!: Appointment[];

    @ManyToOne(() => Portfolio, (portfolio) => portfolio.appointment_portfolios)
    @JoinColumn({ name: "appointment_id" })  
    portfolio!: Portfolio[];

  
    }
