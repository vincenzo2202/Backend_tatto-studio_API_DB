import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("appointments")
export class Appointment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "date" })
    date!: string; 

    @Column({ type: "time" })
    time!: string;

    @Column()
    status!: boolean

    @Column()
    worker_id!: number

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date

}
