import moongose, { Model, Document } from "mongoose"
import Password from "../services/password"

interface IUser {
    email: string,
    password: string
}

interface IUserDoc extends Document {
    email: string,
    password: string
}

interface IUserModel extends Model<IUserDoc> {
    build(attrs: IUser): IUserDoc
}

const userSchema = new moongose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.password
        },
        versionKey: false
    }
})

userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashedPassword = await Password.toHash(this.get("password"))
        this.set("password", hashedPassword)
    }

    done()
})

userSchema.statics.build = (user: IUser) => {
    return new User(user)
}

export const User = moongose.model<IUserDoc, IUserModel>("User", userSchema)