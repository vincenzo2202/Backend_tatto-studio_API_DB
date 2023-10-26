import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Role } from "./Role"
import { Worker } from "./Worker"
import { Client } from "./Client"

@Entity("users")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    full_name!: string

    @Column()
    email!: string

    @Column()
    password!: string

    @Column()
    phone_number!: number

    @Column()
    is_active!: boolean

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date 

    @OneToMany(() => Worker, (worker) => worker.user)
    workers!: Worker[];

    @OneToMany(() => Client, (client) => client.user)
    clients!: Client[];

    @ManyToMany(() => Role)
    @JoinTable({
        name: "role_user",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id",
        },
    })
    userRoles!: Role[];

}
