import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Store } from "./store.model";
import { GiftExchange } from "./gift-exchange.model";
import { Url } from "url";

@Entity('gifts')
export class Gift extends BaseEntity {
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
        type: 'int'
    })
    pointRequired: number

    @Column({
        type: 'timestamp'
    })
    expirationDate: Date

    @Column({
        type: 'int',
        default: 0
    })
    quantityAvailable: number

    @ManyToOne(() => Store, (store) => store.gifts)
    store: Store

    @OneToMany(() => GiftExchange, (giftExchange) => giftExchange.gift)
    exchangeGifts: GiftExchange[];
}