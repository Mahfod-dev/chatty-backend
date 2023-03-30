import {Application,json,urlencoded,Response,Request,NextFunction} from 'express';
import 'colors';
import {createServer} from 'http';
import cors from 'cors'
import helmet from 'helmet';
import hpp from 'hpp'
import CookieSession from 'cookie-session'
import morgan from 'morgan'
import {config} from 'dotenv'
import StatusCodes from 'http-status-codes';
import 'express-async-errors'
import compression from 'compression'
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import Router from './routes/routes';
import { errorHandler } from '@global/helpers/error-handler'
import createLogger from '@config/config'
config()

morgan(':method :url :status :res[content-length] - :response-time ms')

const logger = createLogger('server')

const standardMiddleware = (app: Application) => {
	app.use(
		json({
			limit: '50mb',
		}),
	)

	app.use(urlencoded({ extended: true, limit: '50mb' }))

	app.use(compression())
}

const securityMiddleware = (app: Application) => {
	app.use(helmet())

	app.use(hpp())

	app.use(
		cors({
			origin: process.env.CLIENT_URL,
			credentials: true,
			optionsSuccessStatus: StatusCodes.OK,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		}),
	)

	app.use(
		CookieSession({
			name: 'session',
			keys: [process.env.SECRET_KEY_ONE!, process.env.SECRET_KEY_TWO!],
			secure: process.env.NODE_ENV !== 'development',
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
			secureProxy: false,
		}),
	)
}

const globalErrorHandler = (app: Application) => {
	app.all('*', (req: Request, res: Response) => {
		res.status(StatusCodes.NOT_FOUND).send('Route not found')
	})

	app.use(errorHandler)
}

const RoutesMiddleware = (app: Application) => {
	app.use('/api', Router)
}

const createSocketServer = async (server: any) => {
	const io = new Server(server, {
		cors: {
			origin: process.env.CLIENT_URL,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
			optionsSuccessStatus: StatusCodes.OK,
		},
	})

	const pubClient = createClient({
		url: process.env.REDIS_HOST,
	})

	const subClient = pubClient.duplicate()

	await Promise.all([pubClient.connect(), subClient.connect()])
	io.adapter(createAdapter(pubClient, subClient))

	return io
}

const setupServer = (app: Application) => {
	const server = createServer(app)

	const port = process.env.PORT || 3000

	server.listen(port, () => {
		console.log(`Server is running on port ${port}`.blue.bold)
	})

	return server
}

export const startServer = (app: Application) => {

    logger.info(`Starting server...${process.pid}`.yellow.bold);

    standardMiddleware(app);
    securityMiddleware(app);
    createSocketServer(createServer(app));
    setupServer(app);
    RoutesMiddleware(app);
    globalErrorHandler(app);
}



