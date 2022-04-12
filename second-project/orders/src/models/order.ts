import moongose, { Model, Document, Schema } from "mongoose"
import { OrderStatus } from "@vhr_gittix/common-lib"
import { ITicketDoc } from "./ticket"

export { OrderStatus }

interface IOrder {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: ITicketDoc
}

interface IOrderDoc extends Document, IOrder { }

interface IOrderModel extends Model<IOrderDoc> {
    build(attrs: IOrder): IOrderDoc
}

const orderSchema = new moongose.Schema({
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus)
    },
    expiresAt: {
        type: Schema.Types.Date,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: "Ticket"
    }
}, {
    toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id
            delete ret._id
        },
        versionKey: false
    }
})

orderSchema.statics.build = (attrs: IOrder) => {
    return new Order(attrs)
}

export const Order = moongose.model<IOrderDoc, IOrderModel>("Order", orderSchema)