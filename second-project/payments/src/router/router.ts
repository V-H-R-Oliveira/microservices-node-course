import { authHandler, validateRequestHandler } from "@vhr_gittix/common-lib"
import { Router } from "express"
import { body } from "express-validator"
import { createChargeHandler } from "../routes/createCharge"

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

export { router }