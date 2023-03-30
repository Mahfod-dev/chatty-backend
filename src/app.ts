import express,{Express} from 'express'
import { startServer } from './setupServer'
import connectDB from './config/setupDatabase'
import cloundinaryConfig from '@config/cloudinary'

const app: Express = express()

connectDB()

cloundinaryConfig()
startServer(app)


