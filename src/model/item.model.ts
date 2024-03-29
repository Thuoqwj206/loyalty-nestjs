import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Store } from "./store.model";
import { OrderItem } from "./order-item.model";
import { Url } from "url";

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
    image: Url

    @Column({
        type: 'float',
    })
    price: number

    @Column({
        type: 'int'
    })
    quantityAvailable: number

    @ManyToOne(() => Store, (store) => store.items, {
        onDelete: 'CASCADE'
    })
    store: Store

    @OneToMany(() => OrderItem, (orderItem) => orderItem.item)
    orderItems: OrderItem[]
}