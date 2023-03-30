import express,{Express} from 'express'
import { startServer } from './setupServer'
import connectDB from './config/setupDatabase'



const app:Express = express()

connectDB()

startServer(app)


