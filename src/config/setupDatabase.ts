import mongoose from 'mongoose'
import { createLogger } from './config'

const logger = createLogger('database')

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI!)

		logger.info(`MongoDB Connected: ${conn.connection.host}`.bgBlue.bold)
	} catch (err) {
		logger.error(err)
		process.exit(1)
	}
}

mongoose.connection.on('connected', connectDB)

export default connectDB
