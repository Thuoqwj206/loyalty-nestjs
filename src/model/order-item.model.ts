import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.model";
import { Order } from "./order.model";

@Entity('order-item')
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number

    @ManyToOne(() => Order, order => order.orderItems, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    order: Order;

    @ManyToOne(() => Item, item => item.orderItems, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    item: Item;

    @Column({
        type: 'int'
    })
    quantity: number
}