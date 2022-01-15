import { describe, test, expect } from "@jest/globals"
import { validate } from "uuid"
import { MEMORY_DB } from "../constants/constants.js"
import RepositoryFactory from "../repository/repositoryFactory.js"

describe("Testing Repositories", () => {
    const repositories = [RepositoryFactory.getRepository(MEMORY_DB)]

    test.each(repositories)("It should save a comment and return an valid uuid", (repository) => {
        const commentId = repository.savePostComment("1234", {title: "test", content: "testing", postId: "1234"})
        const isValidUUID = validate(commentId)
        expect(isValidUUID).toBeTruthy()
    })

    test.each(repositories)("It should return a list of comments by postId", (repository) => {
        const comments = repository.fetchPostsComents("1")
        expect(comments).toBeInstanceOf(Array)
    })

    test.each(repositories)("It should return a non empty list of comments given a post with comments", (repository) => {
        const comments = repository.fetchPostsComents("1234")
        expect(comments).not.toHaveLength(0)
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