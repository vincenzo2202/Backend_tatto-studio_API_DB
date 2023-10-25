import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("role_user")
export class Role_user extends BaseEntity {
@PrimaryGeneratedColumn()
id!: number

@Column()
role_id!: number

@Column()
user_id!: number

@Column()
created_at!: Date

@Column()
updated_at!: Date

}
