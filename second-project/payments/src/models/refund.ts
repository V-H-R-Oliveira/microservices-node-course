import { Model, Document, Schema, model } from "mongoose"

interface IRefund {
    refundId: string,
    orderId: string
}

interface IRefundDoc extends Document, IRefund { }

interface IRefundModel extends Model<IRefundDoc> {
    build(attrs: IRefund): IRefundDoc
}

const refundSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    refundId: {
        type: String,
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

refundSchema.statics.build = (attrs: IRefund) => {
    return new Refund(attrs)
}

export const Refund = model<IRefundDoc, IRefundModel>("Refund", refundSchema)