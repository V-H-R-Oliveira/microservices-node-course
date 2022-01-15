import React from "react"
import { test, expect} from "@jest/globals"
import { render, screen } from "@testing-library/react"
import App from "./App"

// TODO: write tests for the components

test("renders learn react link", () => {
    render(<App />)
    const linkElement = screen.getByText(/learn react/i)
    expect(linkElement).toBeInTheDocument()
})
