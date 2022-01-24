import { MEMORY_DB } from "../constants/constants.js"
import MemoryRepository from "./memoryRepository.js"

export default class RepositoryFactory {
    static getRepository(repositoryType) {
        switch (repositoryType) {
        case MEMORY_DB:
            return new MemoryRepository()
        default:
            throw new Error(`Repository ${repositoryType} is invalid`)
        }
    }
}