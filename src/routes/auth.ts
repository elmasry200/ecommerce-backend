import {Router} from 'express'
import { signup, signin, refresh, logout} from '../controllers/auth'
import { loginLimiter } from '../middlewares/loginLimiter'

const authRoutes:Router = Router()

authRoutes.post('/signup', signup)
authRoutes.post('/signin', [loginLimiter], signin)
authRoutes.get('/refresh', refresh)
authRoutes.post('/logout', logout)

export default authRoutes