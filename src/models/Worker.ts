import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm"
import { User } from "./User"
import { Client } from "./Client"
import { Portfolio } from "./Portfolio"

@Entity("workers")
export class Worker extends BaseEntity {
@PrimaryGeneratedColumn()
id!: number

@Column()
hours_worked!: number

@Column()
user_id!: number

@Column()
created_at!: Date

@Column()
updated_at!: Date

@ManyToOne(() => User, (user) => user.workers)
@JoinColumn({ name: "user_id" }) // campo personalizado en la bd
user!: User;

@ManyToMany(() => Client)
@JoinTable({
    name: "appointment",
    joinColumn: {
        name: "worker_id",
        referencedColumnName: "id",
    },
    inverseJoinColumn: {
        name: "client_id",
        referencedColumnName: "id",
    },

})
workerClients!: Client[];


@ManyToMany(() => Portfolio)
@JoinTable({
    name: "portfolio_worker",
    joinColumn: {
        name: "worker_id",
        referencedColumnName: "id",
    },
    inverseJoinColumn: {
        name: "portfolio_id",
        referencedColumnName: "id",
    },

})
workerPorfolio!: Portfolio[];

}
