import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm"

@Entity("portfolio")
export class Portfolio extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    category!: string

    @Column()
    image!: string

    @Column()
    price!: number

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date


    @ManyToMany(() => Worker)
    @JoinTable({
        name: "portfolio_worker",
        joinColumn: {
            name: "portfolio_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "worker_id",
            referencedColumnName: "id",
        },

    })
    portfolioWorkers!: Worker[];

}
