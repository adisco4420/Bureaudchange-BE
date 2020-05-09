import { BaseService } from '../services/base.service';
import { BasicResponse } from "../dtos/outputs/basicresponse";
import { Status } from '../dtos/enums/statusenums';
import { Request, Response } from "express";
import UserModel from "../models/user.model";

class UserBankController extends BaseService {
    public async Add(req: Request, res: Response) {
        try {            
            let responseObj = null;
            const user = await UserModel.findOneAndUpdate({
                    _id: req.user._id,
                    'wallet.symbol': {$eq: req.body.currency},
                    'bankAccounts.currency': {$ne: req.body.currency},
                }, 
                {
                    $push: {
                        bankAccounts: {...req.body}
                    }
                }, {new: true})            
            if(user) {
                responseObj =  new BasicResponse(Status.CREATED,{ msg: 'Bank Added Successfully', data: []});
            } else {
                responseObj =  new BasicResponse(Status.UNPROCESSABLE_ENTRY,{ msg: 'Bank Currency Already Exist'});
            }
            this.sendResponse(responseObj, req, res);
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);  
        }
    }
    public async GetAll(req: Request, res: Response) {
        try {
            const user = await UserModel.findById(req.user._id, {bankAccounts: true});
            if(user) {
                this.sendResponse(new BasicResponse(Status.SUCCESS, { msg: 'User Banks', data: user}), req, res);
            } else {
                this.sendResponse(new BasicResponse(Status.UNPROCESSABLE_ENTRY, { msg: 'User not found', data: user}), req, res);
            }
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);
        }
    }
    public async Update(req: Request, res: Response) {
        try {            
            let responseObj = null;
            const user = await (UserModel as any).findOneAndUpdate(
                {
                    _id: req.user._id,
                    'bankAccounts.currency': {$eq: req.body.currency},
                }, 
                { $set: {'bankAccounts.$[elem]': {...req.body} }}, 
                { arrayFilters: [ { "elem.currency": { $eq: req.body.currency } } ] }
                )            
            if(user) {
                responseObj =  new BasicResponse(Status.SUCCESS,{ msg: 'Bank Updated Successfully', data: []});
            } else {
                responseObj =  new BasicResponse(Status.UNPROCESSABLE_ENTRY,{ msg: 'User not found or Bank Currency does not exist'});
            }
            this.sendResponse(responseObj, req, res);
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);  
        }
    }
    public async Delete(req: Request, res: Response) {
        try {            
            console.log('currency', req.params.currency);
            
            let responseObj = null;
            const user = await UserModel.findOneAndUpdate(
                {
                    _id: req.user._id,
                    'bankAccounts.currency': {$eq: req.params.currency},
                }, 
                { $pull: {bankAccounts: {currency: req.params.currency}}}, 
                {new: true}
                )            
            if(user) {
                responseObj =  new BasicResponse(Status.SUCCESS,{ msg: 'Bank Deleted Successfully', data: []});
            } else {
                responseObj =  new BasicResponse(Status.UNPROCESSABLE_ENTRY,{ msg: 'User not found or Bank Currency does not exist'});
            }
            this.sendResponse(responseObj, req, res);
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);  
        }
    }
}

export default new UserBankController;