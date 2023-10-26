import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm"

@Entity("portfolio_worker")
export class Portfolio_worker extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
  
    @Column()
    portfolio_id!: number

    @Column()
    worker_id!: number
    
    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date

  
    }
