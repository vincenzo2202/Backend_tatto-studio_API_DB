import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("workers")
export class Worker extends BaseEntity {
@PrimaryGeneratedColumn()
id!: number

@Column()
hours_worked!: number

@Column()
client_id!: number

@Column()
created_at!: Date

@Column()
updated_at!: Date

}
