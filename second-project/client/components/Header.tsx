import { FC } from "react"
import Link from "next/link"
import { ICurrentUser } from "./ICommonTypes"

const Header: FC<ICurrentUser> = ({ currentUser }) => {
    const links = [
        !currentUser && { label: "Signup", href: "/auth/signup" },
        !currentUser && { label: "Signin", href: "/auth/signin" },
        currentUser && { label: "Signout", href: "/auth/signout" }
    ].filter((link) => link).map((link, key) => {
        return (
            <li key={key} className="nav-item">
                <Link href={link?.href}><a className="nav-link">{link?.label}</a></Link>
            </li>
        )
    })

    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/"><a className="navbar-brand">GitTix</a></Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </nav>
    )
}

export default Header