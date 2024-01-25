import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.model";
import { Order } from "./order.model";

@Entity('order-item')
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    public orderItemId: number

    @ManyToOne(() => Order, order => order.orderItems)
    order: Order;

    @ManyToOne(() => Item, item => item.orderItems)
    item: Item;

    @Column({
        type: 'int'
    })
    quantity: number
}