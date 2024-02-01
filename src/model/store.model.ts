import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { User } from "./user.model";
import { Gift } from "./gift.model";
import { EStatus } from "src/enum";
import { Item } from "./item.model";
import { Order } from "./order.model";
import { GiftOrder } from "./gift-order.model";
import { Exclude } from "class-transformer";

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
    @Exclude()
    password: string

    @Column({
        type: "timestamp",
        default: null
    })
    email_verified_at: Date

    @Column({
        type: "enum",
        enum: EStatus,
        default: EStatus.INVALIDATED
    })
    status: EStatus

    @OneToMany(() => User, (user) => user.store)
    @JoinColumn()
    users: User[]

    @OneToMany(() => Gift, (gift) => gift.store)
    gifts: Gift[]

    @OneToMany(() => Item, (item) => item.store)
    items: Item[]

    @OneToMany(() => Order, (order) => order.store)
    orders: Order[]

    @OneToMany(() => GiftOrder, (giftOrder) => giftOrder.store)
    giftOrders: GiftOrder[]
}