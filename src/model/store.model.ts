import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";

export enum Status {
    VALIDATED = 'VALIDATED',
    INVALIDATED = 'INVALIDATED'
}

@Entity('stores')
export class Store extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        nullable: false
    })
    name: string

    @Column({
        type: 'varchar',
        length: 15
    })
    phone: string

    @Column({
        type: 'varchar'
    })
    email: string

    @Column({
        type: 'varchar',
        nullable: false
    })
    password: string

    @Column({
        type: "timestamp",
        default: null
    })
    email_verified_at: Date

    @Column({
        type: "enum",
        enum: Status,
        default: Status.INVALIDATED
    })
    status: Status

}