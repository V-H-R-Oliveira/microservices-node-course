import { scrypt, randomBytes } from "crypto"
import { promisify } from "util"

const scryptAsync = promisify(scrypt)
const KEY_LENGTH = 10

export default class Password {

    static async toHash(password: string) {
        const salt = randomBytes(8).toString("hex")
        const hashedPasswordBuffer = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer
        return `${hashedPasswordBuffer.toString("hex")}.${salt}`
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [ storedPasswordHash, storedPasswordSalt ] = storedPassword.split(".")
        const hashedPasswordBuffer = (await scryptAsync(suppliedPassword, storedPasswordSalt, KEY_LENGTH)) as Buffer
        const hashedPasswordString = hashedPasswordBuffer.toString("hex")
        return storedPasswordHash == hashedPasswordString
    }
}