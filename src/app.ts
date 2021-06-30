import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { __devMode } from './utils/constants'
import chapter from './router/chapter'
import manga from './router/manga'

dotenv.config()

/** Instance & Variable */
const app: Application = express()
const appPort: number = Number(process.env.APP_PORT) || 5000

app.set('trust proxy', true)

/** Express Middleware */
app.use(morgan(__devMode ? 'dev' : 'common'))
app.use(
  cors({
    origin: '*',
    methods: 'GET',
  }),
)

/** Homepage */
app.get('/', (req: Request, res: Response) =>
  res.json({
    message: 'KomikuAPI',
    author: 'ntbz',
  }),
)

/** Router */
app.use(chapter)
app.use(manga)

/** Not Found */
app.use('*', (req, res, next) =>
  res.status(404).json({
    status: false,
    error: 'not found',
    message: 'apa yang anda cari ?',
  }),
)

/** Start */
app.listen(appPort, () => console.log(new Date().toLocaleString(), `App Listening on :${appPort}`))
