import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GiftOrder } from "./gift-order.model";
import { Gift } from "./gift.model";

@Entity('gift-exchanges')
export class GiftExchange extends BaseEntity {
    @PrimaryGeneratedColumn()
    public exchangeGiftId: number

    @ManyToOne(() => GiftOrder, giftOrder => giftOrder.exchangeGifts)
    giftOrder: GiftOrder;

    @ManyToOne(() => Gift, gift => gift.exchangeGifts)
    gift: Gift;

    @Column({
        type: 'int'
    })
    quantity: number
}