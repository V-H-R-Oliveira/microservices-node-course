import { Router } from "express"
import { insertTicketHandler } from "../routes/insertTicketHandler"
import { authHandler, validateRequestHandler } from "@vhr_gittix/common-lib"
import { body, param } from "express-validator"
import { getTicketByIdHandler } from "../routes/getTicketByIdHandler"
import { getAllTicketsHandler } from "../routes/getAllTicketsHandler"
import { updateTicketByIdHandler } from "../routes/updateTicketByIdHandler"

const router = Router({ strict: true, caseSensitive: true })

router.post(
    "/",
    authHandler,
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("price")
        .isFloat({ gt: 0 })
        .withMessage("Price is required"),
    validateRequestHandler,
    insertTicketHandler
)

router.get("/", getAllTicketsHandler)

router.get(
    "/:id",
    param("id").trim().isMongoId().withMessage("Invalid ticket id"),
    validateRequestHandler,
    getTicketByIdHandler
)

router.put(
    "/:id",
    authHandler,
    param("id").trim().isMongoId().withMessage("Invalid ticket id"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("price")
        .isFloat({ gt: 0 })
        .withMessage("Price is required"),
    validateRequestHandler,
    updateTicketByIdHandler
)

export { router }