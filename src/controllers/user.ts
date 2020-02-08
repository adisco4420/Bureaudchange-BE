
import { BaseService } from "../services/base";
import { BasicResponse } from "../dtos/outputs/basicresponse";
import { Status } from '../dtos/enums/statusenums';
import { NextFunction, Request, Response } from "express";
import { hashSync } from 'bcrypt-nodejs'
import UserModel from '../schemas/user'

export class UserController extends BaseService {

    public async Register(req: Request, res: Response, next: NextFunction) {
        try {        
            req.body.password = hashSync(req.body.password)
            await UserModel.create({...req.body})
            let responseObj = new BasicResponse(Status.CREATED, {msg:'Your account is ready'});
            //this.sendMail(req, res, next, dto.email, output.token, dto.baseUrl, "confirmation")          
             this.sendResponse(responseObj, req, res);
        } catch (error) {
            if(error.code === 11000) {
                const msg = `This email already exists (${req.body.email})`
                this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, {msg}), req, res);
            } else {
                this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);
            }            
        }
    }
    
 }
