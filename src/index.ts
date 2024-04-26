import express, {Express, Request, Response} from 'express'
import { PORT } from './secrets'
import rootRouter from './routes'
import cookieParser = require("cookie-parser")
import cors = require("cors")
import { corsOptions } from '../src/config/corsOptions'

const app:Express = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/api', rootRouter)


app.listen(PORT, () => {console.log('App working!')})