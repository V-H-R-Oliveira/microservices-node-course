interface IUserCookie {
    id: string,
    email: string
}

export interface ICurrentUser {
    currentUser: IUserCookie | null
}

export interface ITicket {
    title: string,
    price: number,
    userId: string,
    id: string,
    orderId?: string
}

export interface IOrder {
    expiresAt: string,
    id: string,
    status: string,
    ticket: ITicket,
    userId: string
}