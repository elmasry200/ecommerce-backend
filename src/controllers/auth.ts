import { Request, Response } from "express"
import { PrismaClient } from '@prisma/client'
import { compareSync, hashSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../secrets"
import { SignUpSchema } from '../schema/users'

export const signup = async (req: Request, res: Response) => {

  try {
    SignUpSchema.parse(req.body)
    const { email, password, phone, name } = req.body;
    const prisma = new PrismaClient();
    let user;
    if (email) {
      user = await prisma.user.findFirst({ where: { email } })
      if (user) {
        throw Error('User already exits!');
      }
      user = await prisma.user.create({
        data: {
          firstName: name,
          email,
          password: hashSync(password, 10)
        }
      })
    } else if (phone) {
      user = await prisma.user.findFirst({ where: { phone } })
      if (user) {
        throw Error('User already exits!');
      }
      user = await prisma.user.create({
        data: {
          firstName: name,
          phone,
          password: hashSync(password, 10)
        }
      })
    } else {
      throw Error('Inter your email or phone');
    }
    delete (user as { password?: string }).password;
    res.json(user);
  } catch {
    throw Error('Inter your data');
  }
}

export const signin = async (req: Request, res: Response) => {

  const { email, password, phone } = req.body;
  const prisma = new PrismaClient();
  let user;
  if (email) {
    user = await prisma.user.findFirst({ where: { email } })
    if (!user) {
      throw Error('Something wrong!');
    }

  } else if (phone) {
    user = await prisma.user.findFirst({ where: { phone } })
    if (!user) {
      throw Error('Something wrong!');
    }
  }

  if (!compareSync(password, user?.password!)) {
    throw Error('password wrong!');
  }
  delete (user as { password?: string }).password;

  // create jwts

  const accessToken = jwt.sign(
    {
      "UserInfo": {
        "userid": user?.id,
        "roles": user?.role
      }
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '10s' }
  )

  const refreshToken = jwt.sign(
    { "userid": user?.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  )

  // Create secure cookie with refresh token 
  res.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server 
    secure: false, //https    
    maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
  })


  res.json({ user, accessToken });
}

export const refresh = (req: Request, res: Response) => {

  const prisma = new PrismaClient();

  const cookies = req.cookies

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET,
    async (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: 'Forbidden' })

      const foundUser = await prisma.user.findFirst({ where: { id: decoded.userid } })

      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": foundUser.id,
            "roles": foundUser.role
          }
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      )

      res.json({ accessToken })
    }
  )
}

export const logout = (req: Request, res: Response) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //No content
  res.clearCookie('jwt', { httpOnly: true, secure: true })
  res.json({ message: 'Cookie cleared' })
}
