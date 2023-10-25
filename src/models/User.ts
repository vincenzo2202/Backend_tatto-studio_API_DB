import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("users")
export class User extends BaseEntity {

@PrimaryGeneratedColumn()
id!: number

@Column()
full_name!:string

@Column()
email!:string

@Column()
password!:string

@Column()
phone_number!:number

@Column()
is_active!:boolean

@Column()
created_at!:Date

@Column()
updated_at!:Date

}
