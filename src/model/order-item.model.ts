import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.model";
import { Order } from "./order.model";

@Entity('order-item')
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    public orderItemId: number

    @ManyToOne(() => Order, order => order.orderItems)
    @JoinColumn()
    order: Order;

    @ManyToOne(() => Item, item => item.orderItems)
    @JoinColumn()
    item: Item;

    @Column({
        type: 'int'
    })
    quantity: number
}