import chalk = require('chalk');
import { BasicResponse } from "../dtos/outputs/basicresponse";
import crypto = require('crypto');
import { NextFunction, Request, Response } from "express";



export class BaseService {

    protected errors;

    protected hasErrors(errors: any): boolean {
        return !(errors === undefined || errors.length == 0)
    }

    protected sha256(data) {
        return crypto.createHash("sha256").update(data, "utf8").digest("base64");
    }

    protected sendError(req: Request, res: Response, next: NextFunction, data?: Object) {

        var dat = {
            status: 400,
            data: data
        }
        res.status(401);
        res.send(dat);

    }

    public sendResponse(serviceResponse: BasicResponse, req: Request, res: Response): any {
        // console.log(serviceResponse);
        
        var response = {
            status: serviceResponse.getStatusString(),
            data: serviceResponse.getData()
        }

        res.status(this.getHttpStatus(serviceResponse.getStatusString()));

        console.log('responding with', response);
        res.json(response);
    }

    protected sendException(ex, serviceResponse: BasicResponse, req: Request, res: Response, next: NextFunction): any {
        console.log(chalk.default.blue.bgRed.bold(ex));
        this.sendResponse(serviceResponse, req, res);
    }
  
    private getHttpStatus(status: string): number {
        switch (status) {
            case 'SUCCESS':
                return 200;
            case 'CREATED':
                return 201;
            case 'SUCCESS_NO_CONTENT':
                return 204;
            case 'FAILED_VALIDATION':
                return 400;
            case 'NOT_FOUND':
                return 404;
            case 'CONFLICT':
                return 409;
            case 'UNPROCESSABLE_ENTRY':
                return 422;
            case 'UNATHORIZED':
                return 401;
            case 'PRECONDITION_FAILED':
                return 412;
            default:
                return 500;
        }
    }

    protected logInfo(info: string) {
        console.log(chalk.default.blue.bgGreen.bold(info));
    }

    protected logError(error: string) {
        console.log(chalk.default.blue.bgRed.bold(error));
    }

}