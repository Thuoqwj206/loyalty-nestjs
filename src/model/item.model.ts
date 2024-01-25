import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Store } from "./store.model";
import { OrderItem } from "./order-item.model";

@Entity('items')
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
    })
    name: string

    @Column({
        type: 'varchar',
    })
    image: string

    @Column({
        type: 'float',
    })
    price: number

    @Column({
        type: 'int'
    })
    quantityAvailable: number

    @ManyToOne(() => Store, (store) => store.items)
    store: Store

    @OneToMany(() => OrderItem, (orderItem) => orderItem.item)
    orderItems: OrderItem[]
}