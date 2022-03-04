interface IUserCookie {
    id: string,
    email: string
}

export interface ICurrentUser {
    currentUser: IUserCookie | null
}
