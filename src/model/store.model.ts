import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { User } from "./user.model";
import { Gift } from "./gift.model";
import { Item } from "./item.model";
import { Order } from "./order.model";
import { GiftOrder } from "./gift-order.model";
import { Exclude } from "class-transformer";
import { EStatus } from "src/enum";
import { EFormula } from "src/enum/store-enum/rank-formula.enum";

@Entity('stores')
export class Store extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        nullable: false,
        unique: true
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
        type: 'enum',
        enum: EFormula,
        default: EFormula.LIMITATION
    })
    rankFormula: EFormula

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