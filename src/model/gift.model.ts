import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Store } from "./store.model";
import { ExchangeGift } from "./exchange-gift.model";

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
    file: string

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

    @OneToMany(() => ExchangeGift, (exchangeGift) => exchangeGift.gift)
    exchangeGifts: ExchangeGift[];
}