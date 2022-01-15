import { MEMORY_DB } from "../constants/constants"
import MemoryRepository from "./memory"

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
