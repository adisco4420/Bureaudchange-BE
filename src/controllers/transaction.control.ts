import { Status } from '../dtos/enums/statusenums';
import { BaseService } from "../services/base.service";
import { Request, Response } from "express";
import { TransI } from '../interfaces/interfaces';
import TransModel from '../models/transaction.model';
import { BasicResponse } from '../dtos/outputs/basicresponse';
import WalletSrv from '../services/wallet.service';
import WalletController from './wallet.control';

class TransactionController extends BaseService {
    Create(payload: TransI): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            const {amount, userEmail, type, status} = payload
            if(payload && amount && userEmail && type && status) {
                const result = TransModel.create({...payload});
                resolve(result);
            } else {
                reject('payload=>{userEmail, amount, type, status} --> are required');
            }
        });
        return promise; 
    } 
    async Update(req: Request, res: Response) {
        try {
            let responseObj = null;
            const {id, status} = req.params;
            const trans: TransI = (await TransModel.findById(id)).toJSON();
            if(trans) {
                const {recieveCun, payCun, amount, userEmail: email} = trans;
                switch (trans.type) {
                    case 'deposit':
                        console.log('deposit');
                        break;
                    case 'exchange':
                        const exchangeRate = await WalletSrv.ExchangeRate({recieveCun, payCun});
                        const total = Number(amount/exchangeRate);
                        const payload: any = {amount: total, currency: recieveCun, email }
                        await WalletController.FundWallet(payload);
                        const result = await TransModel.findByIdAndUpdate(id, {status: 'success'}, {new: true});
                        responseObj = new BasicResponse(Status.SUCCESS, {data: result});
                        break;
                    default:
                        break
                }
            } else {
                responseObj = new BasicResponse(Status.NOT_FOUND, {msg: 'Transaction not found'})
            }

            this.sendResponse(responseObj, req, res);
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);  
        }
    }
    async GetUserTrans(req: Request, res: Response) {
        try {
            const userTrans = await TransModel.find({userEmail: req.user.email}).sort({date: -1});
            this.sendResponse(new BasicResponse(Status.SUCCESS, { msg: 'User Transactions', data: userTrans}), req, res);
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);
        }
    }
    async GetAllTrans(req: Request, res: Response) {
        try {
            const allTrans = await TransModel.find({}).sort({date: -1});
            this.sendResponse(new BasicResponse(Status.SUCCESS, { msg: 'All Transactions', data: allTrans}), req, res);
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);
        }
    }
}

export default new TransactionController;