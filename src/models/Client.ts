import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("clients")
export class Client extends BaseEntity {
@PrimaryGeneratedColumn()
id!: number

@Column()
client_id!: number

@Column()
created_at!: Date

@Column()
updated_at!: Date

}
