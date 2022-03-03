import axios, { AxiosRequestHeaders } from "axios"
import { NextPageContext } from "next"

export const buildHttpClient = (ctx?: NextPageContext) => {
    return axios.create({
        baseURL: typeof window === 'undefined' ? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local" : "",
        headers: ctx?.req?.headers as AxiosRequestHeaders
    })
}