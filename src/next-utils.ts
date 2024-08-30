import next from "next"

// Get the port from the environment, or default to 3000

const PORT = Number(process.env.PORT) || 3000

// Create a new Next.js app

export const nextApp = next({
    dev: process.env.NODE_ENV !== "production",
    port: PORT
})

export const nextHandler = nextApp.getRequestHandler()