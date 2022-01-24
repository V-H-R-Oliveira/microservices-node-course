import { COMMENT_MODERATED, COMMENT_REJECTED } from "../constants/constants.js"

const getModerationStatus = (content) => {
    return content.includes("orange") ? COMMENT_REJECTED : COMMENT_MODERATED
}

export { getModerationStatus }