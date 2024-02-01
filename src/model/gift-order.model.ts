import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { Store } from "./store.model";
import { User } from "./user.model";
import { GiftExchange } from "./gift-exchange.model";

@Entity('gift-orders')
export class GiftOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'int',
        default: 0
    })
    totalPoints: number

    @Column({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP"
    })
    createDate: Date

    @ManyToOne(() => User, (user) => user.giftOrders)
    user: User

    @ManyToOne(() => Store, (store) => store.orders)
    store: Store

    @OneToMany(() => GiftExchange, (giftExchange) => giftExchange.giftOrder)
    exchangeGifts: GiftExchange[];
}