import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("portfolio_worker")
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

  
    }
