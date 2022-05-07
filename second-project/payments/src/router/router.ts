import { authHandler, validateRequestHandler } from "@vhr_gittix/common-lib"
import { Router } from "express"
import { body, param } from "express-validator"
import { createChargeHandler } from "../routes/createCharge"
import { getRefundByOrderIdHandler } from "../routes/getRefundByOrderId"

const router = Router({ strict: true, caseSensitive: true })

router.post(
    "/",
    authHandler,
    body("orderId")
        .isMongoId()
        .withMessage("Should be a valid orderId"),
    body("token")
        .isString()
        .not()
        .isEmpty()
        .withMessage("Should be a string"),
    validateRequestHandler,
    createChargeHandler
)

router.get(
    "/refunds/:id",
    authHandler,
    param("id")
        .isMongoId()
        .withMessage("Should be a valid orderId"),
    validateRequestHandler,
    getRefundByOrderIdHandler
)

export { router }