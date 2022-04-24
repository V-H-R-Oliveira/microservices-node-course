import { Model, Document, Schema, model } from "mongoose"

interface IPayment {
    chargeId: string,
    orderId: string
}

interface IPaymentDoc extends Document, IPayment { }

interface IPaymentModel extends Model<IPaymentDoc> {
    build(attrs: IPayment): IPaymentDoc
}

const paymentSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    chargeId: {
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

paymentSchema.statics.build = (attrs: IPayment) => {
    return new Payment(attrs)
}

export const Payment = model<IPaymentDoc, IPaymentModel>("Payment", paymentSchema)