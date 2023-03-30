import { NextFunction,Request,Response } from "express";
import { StatusCodes  } from "http-status-codes";
import createLogger from '@config/config'


export interface IError {
    status: StatusCodes;
    message: string;
    stack?: string;
}

const logger = createLogger('error-handler');

export const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack);
    const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Something went wrong';
  res.status(status).send(message)
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const message = 'Resource not found';
    res.status(StatusCodes.NOT_FOUND).send(message);
}

export const logErrors = (err: IError, req: Request, res: Response, next: NextFunction) => {
   logger.error(err.stack);
    next(err);
}

export const notAuthorizedHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
    if (err.status === StatusCodes.UNAUTHORIZED) {
        res.status(StatusCodes.UNAUTHORIZED).send('Not authorized');
    } else {

        next(err);
    }
}

export const fileTooLargeHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
    if (err.status === StatusCodes.REQUEST_TOO_LONG) {
        res.status(StatusCodes.REQUEST_TOO_LONG).send('File too large');
    } else {
        next(err);
    }
}

export const serverError = (err: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Something went wrong');
}

export const joinErrors = (err: IError, req: Request, res: Response, next: NextFunction) => {
    if (err.status === StatusCodes.BAD_REQUEST) {
        res.status(StatusCodes.BAD_REQUEST).send(err.message);
    } else {
        next(err);
    }
}


// export const wrapAsync = (fn: any) => {
//     return function (req: Request, res: Response, next: NextFunction) {
//         fn(req, res, next).catch(next);
//     };
// }

// export const asyncHandler = (fn: any) => {
//     return function (req: Request, res: Response, next: NextFunction) {
//         fn(req, res, next).catch(next);
//     };
// }

// export const asyncErrorHandler = (fn: any) => {
//     return function (req: Request, res: Response, next: NextFunction) {
//         fn(req, res, next).catch(next);
//     };
// }


