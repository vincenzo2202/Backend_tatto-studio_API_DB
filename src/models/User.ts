import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Role } from "./Role" 
import { Appointment } from "./Appointment"

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
    role!: Role;
 
    @OneToMany(() => Appointment, (appointment) => appointment.client)
    clientAppointments!: Appointment[]; 

    @OneToMany(() => Appointment, (appointment) => appointment.worker)
    workerAppointments!: Appointment[]; 



}
