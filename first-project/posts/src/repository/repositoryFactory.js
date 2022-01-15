import { MEMORY } from "../constants/constants"
import MemoryRepository from "./memory"

export default class RepositoryFactory {
    static getRepository(repository) {
        switch (repository) {
        case MEMORY:
            return new MemoryRepository()
        default:
            throw new Error("Invalid repository type")
        }
    }
}
