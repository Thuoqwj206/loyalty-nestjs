import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExchangeGift } from "./exchange-gift.model";
import { User } from "./user.model";
import { OrderItem } from "./order-item.model";
import { Store } from "./store.model";

@Entity('orders')
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'double',
        default: 0
    })
    totalPrice: number

    @Column({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP"
    })
    createDate: Date

    @ManyToOne(() => User, (user) => user.orders)
    user: User

    @ManyToOne(() => Store, (store) => store.orders)
    store: Store

    @OneToMany(() => OrderItem, (orderItems) => orderItems.order)
    @JoinColumn()
    orderItems: OrderItem[];


}