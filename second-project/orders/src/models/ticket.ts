import moongose, { Model, Document } from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
import { Order, OrderStatus } from "./order"

interface ITicket {
    originalTicketId: string,
    title: string,
    price: number,
}

interface ITicketSearchAttrs {
    id: string,
    version: number
}

export interface ITicketDoc extends Document, ITicket {
    isReserved(): Promise<boolean>,
    version: number
}

interface ITicketModel extends Model<ITicketDoc> {
    findByIdAndPreviousVersion(data: ITicketSearchAttrs): Promise<ITicketDoc|null>
    build(attrs: ITicket): ITicketDoc
}

const ticketSchema = new moongose.Schema({
    title: {
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

ticketSchema.set("versionKey", "version")
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ticket: this as any,
        status: {
            $in: [
                OrderStatus.CREATED,
                OrderStatus.AWAITING_PAYMENT,
                OrderStatus.COMPLETE
            ]
        }
    })

    return !!existingOrder
}

ticketSchema.statics.findByIdAndPreviousVersion = async function(data: ITicketSearchAttrs) {
    return this.findOne({ _id: data.id, version: data.version - 1 })
}

ticketSchema.statics.build = (attrs: ITicket) => {
    return new Ticket({
        _id: attrs.originalTicketId,
        title: attrs.title,
        price: attrs.price
    })
}

export const Ticket = moongose.model<ITicketDoc, ITicketModel>("Ticket", ticketSchema)