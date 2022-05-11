import { Request, Response } from "express"
import { Order } from "../models/order"

const fetchAllOrdersHandler = async (req: Request, res: Response) => {
    const orders = await Order.find({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId: req._currentUser!.id!
    }).populate("ticket")

    res.json(orders)
}

export { fetchAllOrdersHandler }