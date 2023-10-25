import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

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

}
