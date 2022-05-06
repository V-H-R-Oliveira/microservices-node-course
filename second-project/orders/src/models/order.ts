import moongose, { Model, Document, Schema } from "mongoose"
import { OrderStatus } from "@vhr_gittix/common-lib"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
import { ITicketDoc } from "./ticket"

export { OrderStatus }

interface IOrder {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: ITicketDoc
    refundId?: string
}

interface IOrderDoc extends Document, IOrder {
    version: number
}

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
    refundId: {
        type: String
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

orderSchema.set("versionKey", "version")
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: IOrder) => {
    return new Order(attrs)
}

export const Order = moongose.model<IOrderDoc, IOrderModel>("Order", orderSchema)