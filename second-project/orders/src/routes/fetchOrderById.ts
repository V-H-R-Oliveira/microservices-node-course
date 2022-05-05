import { Request, Response } from "express"
import { AuthError, NotFoundError } from "@vhr_gittix/common-lib"
import { Order } from "../models/order"

const fetchOrderById = async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket")

    if (!order) {
        throw new NotFoundError()
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (order.userId != req._currentUser!.id!) {
        throw new AuthError("Cannot access other user orders")
    }

    res.json(order)
}

export { fetchOrderById }