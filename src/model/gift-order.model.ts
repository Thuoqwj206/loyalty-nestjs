import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Store } from "./store.model";
import { User } from "./user.model";
import { ExchangeGift } from "./exchange-gift.model";

@Entity('gift-orders')
export class GiftOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'int'
    })
    totalPoints: number

    @Column({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP"
    })
    createDate: Date

    @ManyToOne(() => User, (user) => user.giftOrders)
    user: User

    @OneToMany(() => ExchangeGift, (exchangeGift) => exchangeGift.giftOrder)
    exchangeGifts: ExchangeGift[];
}