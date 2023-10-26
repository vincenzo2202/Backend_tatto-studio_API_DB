import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { User } from "./User"

@Entity("roles")
export class Role extends BaseEntity {
@PrimaryGeneratedColumn()
id!: number

@Column()
role!: string

@Column()
privilege!: string

@Column()
created_at!: Date

@Column()
updated_at!: Date


@ManyToMany(() => User)
@JoinTable({
    name: "role_user",
    joinColumn: {
        name: "role_id",
        referencedColumnName: "id",
    },
    inverseJoinColumn: {
        name: "user_id",
        referencedColumnName: "id",
    },
})
roleUsers!: User[];

}
