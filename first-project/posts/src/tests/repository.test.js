import { describe, test, expect } from "@jest/globals"
import { validate } from "uuid"
import { MEMORY_DB } from "../constants/constants"
import RepositoryFactory from "../repository/repositoryFactory"

describe("Testing Repositories", () => {
    const repositories = [RepositoryFactory.getRepository(MEMORY_DB)]

    test.each(repositories)("It should save a post and return an valid uuid", (repository) => {
        const postId = repository.savePost({title: "test", content: "testing"})
        const isValidUUID = validate(postId)

        expect(isValidUUID).toBeTruthy()
    })

    test.each(repositories)("It should return a list of posts", (repository) => {
        const posts = repository.fetchPosts()
        expect(posts).toBeInstanceOf(Array)
    })

    test("It should thrown an error when trying to get an invalid repository type", () => {
        const fn = () => RepositoryFactory.getRepository("")
        expect(fn).toThrow(Error)
    })

    test("The error should contain the message 'Invalid repository type'", () => {
        const fn = () => RepositoryFactory.getRepository("")
        expect(fn).toThrow("Invalid repository type")
    })
})