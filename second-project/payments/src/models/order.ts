import { Model, Document, Schema, model } from "mongoose"
import { OrderStatus } from "@vhr_gittix/common-lib"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

interface IOrder {
    originalOrderId: string,
    status: OrderStatus,
    price: number,
    userId: string
}

export interface IOrderDoc extends Document, IOrder {
    version: number
}

interface IOrderSearchAttrs {
    id: string,
    version: number
}

interface IOrderModel extends Model<IOrderDoc> {
    build(attrs: IOrder): IOrderDoc,
    findByIdAndPreviousVersion(data: IOrderSearchAttrs): Promise<IOrderDoc | null>
}

const orderSchema = new Schema({
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus)
    },
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
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
    return new Order({
        _id: attrs.originalOrderId,
        status: attrs.status,
        price: attrs.price,
        userId: attrs.userId
    })
}

orderSchema.statics.findByIdAndPreviousVersion = async function (data: IOrderSearchAttrs) {
    return this.findOne({ _id: data.id, version: data.version - 1 })
}

export const Order = model<IOrderDoc, IOrderModel>("Order", orderSchema)