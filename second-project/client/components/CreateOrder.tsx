import { FC, useEffect, useState } from "react"
import { ICurrentUser, IOrder } from "./ICommonTypes"
import StripeWrapper from "./StripeWrapper"

interface IOrderComponent extends ICurrentUser {
    order: IOrder
}

const CreateOrder: FC<IOrderComponent> = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0)

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = (new Date(order.expiresAt).getTime() - Date.now()) / 1000 // ms left
            setTimeLeft(Math.round(msLeft))
        }

        findTimeLeft()
        const setIntervalId = setInterval(findTimeLeft, 1000)
        return () => clearInterval(setIntervalId)
    }, [order])

    if (order.status == "complete") {
        return (
            <div className="text-center">
                <h1>{order.ticket.title}</h1>
                <h2>{order.ticket.price}</h2>
                <h3>Order Completed.</h3>
            </div>
        )
    }

    if (timeLeft > 0) {
        return (
            <div className="text-center">
                <h1>{order.ticket.title}</h1>
                <h2>{order.ticket.price}</h2>
                <h3>Time left: {timeLeft} seconds until order expires.</h3>
                <StripeWrapper order={order} currentUser={currentUser} />
            </div>
        )
    }

    return (
        <div className="text-center">
            <h1>{order.ticket.title}</h1>
            <h2>{order.ticket.price}</h2>
            <h3>Order Cancelled.</h3>
        </div>
    )
}

export default CreateOrder