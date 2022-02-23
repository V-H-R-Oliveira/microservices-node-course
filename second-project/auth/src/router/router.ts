import { Router } from "express"
import { body } from "express-validator"
import { authHandler } from "../middlewares/authHandler"
import { decodeTokenHandler } from "../middlewares/decodeTokenHandler"
import { validateRequestHandler } from "../middlewares/validateRequest"
import { currentUserHandler } from "../routes/currentUser"

import { signInHandler } from "../routes/signin"
import { signOutHandler } from "../routes/signout"
import { signUpHandler } from "../routes/signup"

const router = Router({ strict: true, caseSensitive: true })

router.get("/current-user", decodeTokenHandler, currentUserHandler)

router.post(
    "/signin",
    body("email").isEmail().normalizeEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must provide a password"),
    validateRequestHandler,
    signInHandler
)

router.post("/signout", decodeTokenHandler, authHandler, signOutHandler)

router.post(
    "/signup",
    body("email").isEmail().normalizeEmail().withMessage("Email must be valid"),
    body("password").trim().isLength({ min: 4, max: 20 }).withMessage("Password must be between 4 and 20 characters"),
    validateRequestHandler,
    signUpHandler
)

export { router }