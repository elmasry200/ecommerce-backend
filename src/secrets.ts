import dotenv from 'dotenv'

dotenv.config({path:'.env'})

export const PORT = process.env.PORT

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!