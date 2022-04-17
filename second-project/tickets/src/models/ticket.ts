import moongose, { Model, Document } from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

interface ITicket {
    userId: string,
    title: string,
    price: number
}

interface ITicketDoc extends Document, ITicket {
    version: number,
    orderId?: string
}

interface ITicketModel extends Model<ITicketDoc> {
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
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String
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

ticketSchema.statics.build = (ticket: ITicket) => {
    return new Ticket(ticket)
}

export const Ticket = moongose.model<ITicketDoc, ITicketModel>("Ticket", ticketSchema)