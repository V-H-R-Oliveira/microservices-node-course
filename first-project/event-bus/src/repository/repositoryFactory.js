import MemoryRepository from "./memory.js"
import { MEMORY_DB } from "../constants/constants.js"

export default class RepositoryFactory {
    static getRepository(repositoryType) {
        switch (repositoryType) {
        case MEMORY_DB:
            return new MemoryRepository()
        default:
            throw new Error("Invalid repository type")
        }
    }
}