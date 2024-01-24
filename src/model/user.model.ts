import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Table } from "typeorm";
export enum Status {
    VALIDATED = 'VALIDATED',
    INVALIDATED = 'INVALIDATED'
}
export enum Rank {
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD'
}
@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
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
        type: 'varchar'
    })
    password: string

    @Column({
        type: 'int',
        default: 0
    })
    point: number

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

    @Column({
        type: "enum",
        enum: Rank,
        default: Rank.BRONZE
    })
    Rank: Rank
}