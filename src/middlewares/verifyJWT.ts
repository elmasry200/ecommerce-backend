import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET } from '../secrets'

export const verifyJWT = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization!

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        ACCESS_TOKEN_SECRET,
        (err:any, decoded:any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.body.userid = decoded.UserInfo.userid
            req.body.roles = decoded.UserInfo.roles
            next()
        }
    )
}