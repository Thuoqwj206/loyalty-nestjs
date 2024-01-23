import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";

@Entity('admins')
export class Admin extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        nullable: false
    })
    name: string

    @Column({
        type: 'varchar'
    })
    email: string

    @Column({
        type: 'varchar'
    })
    password: string

}