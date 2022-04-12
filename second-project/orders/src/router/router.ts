import { authHandler, validateRequestHandler } from "@vhr_gittix/common-lib"
import { Router } from "express"
import { body, param } from "express-validator"
import { createOrderHandler } from "../routes/createOrder"
import { cancelOrderHandler } from "../routes/cancelOrder"
import { fetchAllOrdersHandler } from "../routes/fetchAllOrders"
import { fetchOrderById } from "../routes/fetchOrderById"
const router = Router({ strict: true, caseSensitive: true })

router.get(
    "/",
    authHandler,
    fetchAllOrdersHandler
)

router.post(
    "/",
    authHandler,
    body("ticketId")
        .notEmpty()
        .isMongoId()
        .withMessage("Ticket id must be provided"),
    validateRequestHandler,
    createOrderHandler
)

router.get(
    "/:id",
    authHandler,
    param("id")
        .notEmpty()
        .isMongoId()
        .withMessage("Order id must be provided"),
    validateRequestHandler,
    fetchOrderById
)

router.patch(
    "/:id",
    authHandler,
    param("id")
        .notEmpty()
        .isMongoId()
        .withMessage("Order id must be provided"),
    validateRequestHandler,
    cancelOrderHandler
)

export { router }