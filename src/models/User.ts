import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Role } from "./Role" 

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
    role_id!: number

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date 

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn ({name: "role_id"})
    role!: Role[];
 

    @ManyToMany(() => User)
    @JoinTable({
        name: "appointment",
        joinColumn: {
            name: "client_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "worker_id",
            referencedColumnName: "id"
        }
    })
    clientWorkers!: User[]

    @ManyToMany(() => User)
    @JoinTable({
        name: "appointment",
        joinColumn: {
            name: "worker_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "client_id",
            referencedColumnName: "id"
        }
    })
    workerClients!: User[]

}
