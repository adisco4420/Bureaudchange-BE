
import { BaseService } from "../services/base.service";
import { BasicResponse } from "../dtos/outputs/basicresponse";
import { Status } from '../dtos/enums/statusenums';
import { NextFunction, Request, Response } from "express";
import { compareSync, hashSync } from 'bcrypt-nodejs'
import UserModel from '../models/user.model';
import EmailService from '../services/email.service';
import TokenService from '../services/token.service'
 
class UserController extends BaseService {

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
                     if(!user.isVerified) {
                         responseObj = new BasicResponse(Status.UNPROCESSABLE_ENTRY, {msg:'Account is not verified'});
                        } else {
                            const token = TokenService.sign(user.toJSON(), '12h')
                            responseObj = new BasicResponse(Status.SUCCESS, {msg:'User Login', data: token});
                     }
                }
            }          
            this.sendResponse(responseObj, req, res);
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);           
        }
    }
    public async Confirm(req: Request, res: Response) {
        try {            
            const updateUser = await UserModel.findByIdAndUpdate(req.user.id, {isVerified: true}, { new: true});
            let responseObj = null;
            if(!updateUser) {
                responseObj =  new BasicResponse(Status.UNPROCESSABLE_ENTRY,{ msg: 'User not found'});
            } else {
                const tokenData = TokenService.sign(updateUser.toJSON(), '12h');
                responseObj = new BasicResponse(Status.SUCCESS, {msg:'User Confirmed', data: tokenData})
            }
            this.sendResponse(responseObj, req, res);
        } catch (error) {            
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);  
        }
    }
    public async ResendEmail(req: Request, res: Response) {
        try {
            let responseObj = null;
            const user: any = await UserModel.findOne({email: req.body.email})
            if (!user) {
                responseObj =  new BasicResponse(Status.UNPROCESSABLE_ENTRY,{ msg: 'User not found'});
            } else {
                if (user.isVerified) {
                    responseObj =  new BasicResponse(Status.SUCCESS,{ msg: 'You are already verified'});
                } else {
                    const token = TokenService.sign({id: user.id}, '1h');
                    EmailService.send('confirm', {...user.toJSON(), token, });
                    responseObj =  new BasicResponse(Status.SUCCESS,{ msg: 'Verification message has been sented'});
                }
            }
            this.sendResponse(responseObj, req, res);
          } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);  
          }
    }
    public async WalletSetup(req: Request, res: Response) {
        try {            
            let responseObj = null;
            const user = await UserModel.findOneAndUpdate({
                    _id: req.user._id,
                    'wallet.name': {$ne: req.body.name},
                }, 
                {
                    $push: {
                        wallet: {...req.body}
                    }
                }, {new: true})
            if(user) {
                responseObj =  new BasicResponse(Status.SUCCESS,{ msg: 'Wallet setup', data: user});
            } else {
                responseObj =  new BasicResponse(Status.UNPROCESSABLE_ENTRY,{ msg: 'User not found or Currency exist'});
            }
            this.sendResponse(responseObj, req, res);
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);  
        }
    }
    public async PinSetup(req: Request, res: Response) {
        try {
            req.body.pin = hashSync(req.body.pin);
            const user = await UserModel.findByIdAndUpdate(req.user._id, {pin: req.body.pin}, {new: true});
            if(user) {
                this.sendResponse(new BasicResponse(Status.SUCCESS, { msg: 'Pin setup', data: user}), req, res);
            } else {
                this.sendResponse(new BasicResponse(Status.UNPROCESSABLE_ENTRY, { msg: 'User not found', data: user}), req, res);
            }
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);
        }

    }
    
 }
 export default new UserController