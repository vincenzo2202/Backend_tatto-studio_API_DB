import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm"
import { User } from "./User"
import { Worker } from "./Worker"

@Entity("clients")
export class Client extends BaseEntity {
@PrimaryGeneratedColumn()
id!: number

@Column()
user_id!: number

@Column()
created_at!: Date

@Column()
updated_at!: Date

@ManyToOne(() => User, (user) => user.clients)
@JoinColumn({ name: "user_id" })  
user!: User;

@ManyToMany(() => Worker)
@JoinTable({
    name: "appointment",
    joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
    },
    inverseJoinColumn: {
        name: "worker_id",
        referencedColumnName: "id",
    },

})
userRoles!: Worker[];

}
