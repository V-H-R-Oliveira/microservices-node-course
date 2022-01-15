import { MEMORY_DB } from "../constants/constants.js"
import MemoryRepository from "./memory.js"

export default class RepositoryFactory {
    static getRepository(repository) {
        switch (repository) {
        case MEMORY_DB:
            return new MemoryRepository()
        default:
            throw new Error("Invalid repository type")
        }
    }
}
