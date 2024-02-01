import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Store } from "./store.model";
import { GiftOrder } from "./gift-order.model";
import { EStatus, ERank } from "src/enum";
import { Order } from "./order.model";
import { Exclude } from "@nestjs/class-transformer";
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
    @Exclude()
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
    verified_at: Date

    @Column({
        type: "enum",
        enum: EStatus,
        default: EStatus.INVALIDATED
    })
    status: EStatus

    @Column({
        type: "enum",
        enum: ERank,
        default: ERank.BRONZE
    })
    Rank: ERank

    @ManyToOne(() => Store, (store) => store.users)
    store: Store

    @OneToMany(() => GiftOrder, (giftOrder) => giftOrder.user)
    giftOrders: GiftOrder[]

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]
}