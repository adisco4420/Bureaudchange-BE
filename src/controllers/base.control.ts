import { NextFunction, Request, Response } from "express";
import { BasicResponse } from "../dtos/outputs/basicresponse";

/**
 * Constructor
 *
 * @class BaseController
 */
export class BaseController {

  protected systemErrorMsg: object = {"message" : "Sorry your request could not be completed at the moment"};
  protected invalidCredentials : object = {'message' : 'Invalid Credentials'}; 
  protected notAuthorized : object = {'message' : 'You are not authorized to access this resource'}; 
  protected itemNotFound : object = {'message' : 'Not found'};  
  protected noResults : object = {'message' : 'No results available'};

  protected sendResponse(serviceResponse: BasicResponse, req: Request, res: Response, next: NextFunction): any {
    var response = {
      status : serviceResponse.getStatusString() ,
      data: serviceResponse.getData()
    } 

    res.status(this.getHttpStatus(serviceResponse.getStatusString()));
    const result = response.data ? response.data['msg']: response.data
    console.log('responding with', result);
    res.json(response);
    next();
  }

  private getHttpStatus(status: string): number {
    console.log('status', status);
    
    switch(status){
      case 'SUCCESS':
        return 200;
      case 'CREATED':
        return 201;
      case 'FAILED_VALIDATION':
        return 400;
      case 'UNPROCESSABLE_ENTRY': 
        return 412;
      case 'FORBIDDEN':
        return 403;
      default:
        return 500;
    }
  }

  protected sendError(req: Request, res: Response, next : NextFunction, data?: Object) {
    var dat = {
        status : "error",
        data: data
    }
    res.status(401);
    res.send(dat);
  }
}

