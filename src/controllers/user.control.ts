
import { BaseService } from "../services/base.service";
import { BasicResponse } from "../dtos/outputs/basicresponse";
import { Status } from '../dtos/enums/statusenums';
import { NextFunction, Request, Response } from "express";
import { compareSync, hashSync } from 'bcrypt-nodejs'
import UserModel from '../models/user.model';
import EmailService from '../services/email.service';
import TokenService from '../services/token.service'
 
export class UserController extends BaseService {

    public async Register(req: Request, res: Response, next: NextFunction) {
        try {       
            // console.log('baseurl=',req.host, req.hostname);         
            req.body.password = hashSync(req.body.password)
            const user: any = await UserModel.create({...req.body})
            let responseObj = new BasicResponse(Status.CREATED, {msg:'Your account is ready'});
            const token = TokenService.sign({id: user._id}, '1h');
            EmailService.send('confirm', {...user.toJSON(), token, })
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
    public async Login(req: Request, res: Response, next: NextFunction) {        
        try {        
            const user: any = await UserModel.findOne({email: req.body.email}, '+password');
            let responseObj = null
              if (!user) {
                 responseObj = new BasicResponse(Status.FAILED_VALIDATION, {msg:'Invalid Credentials'});
              } else {
                  const isValidPassword =  compareSync(req.body.password, user.password)
                  if (!isValidPassword){                  
                     responseObj = new BasicResponse(Status.FAILED_VALIDATION, {msg:'Invalid Credentials'});
                  } else {
                     responseObj = new BasicResponse(Status.SUCCESS, {msg:'User Login', data: user});
                }
            }          
            this.sendResponse(responseObj, req, res);
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);           
        }
    }
    
 }
