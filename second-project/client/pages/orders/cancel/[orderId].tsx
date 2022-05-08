import { AxiosInstance } from "axios"
import { NextPage, NextPageContext } from "next/types"
import CancelOrderButton from "../../../components/CancelOrder"
import { ICurrentUser } from "../../../components/ICommonTypes"

interface ICancelOrderPage extends ICurrentUser {
    orderId: string
}

const CancelOrderPage: NextPage<ICancelOrderPage> = ({ orderId, currentUser }) => {
    if (currentUser) {
       return <CancelOrderButton orderId={orderId} />
    }

    return <div>
        <h1 className="text-center">Not authorized</h1>
    </div>
}

CancelOrderPage.getInitialProps = async (ctx: NextPageContext, _client: AxiosInstance, currentUser: ICurrentUser) => {
    const orderId = ctx.query.orderId
    return { orderId, currentUser }
}

export default CancelOrderPage