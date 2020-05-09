import { compareSync } from 'bcrypt-nodejs';
import { BaseService } from "../services/base.service";
import { BasicResponse } from "../dtos/outputs/basicresponse";
import { Status } from '../dtos/enums/statusenums';
import { Request, Response } from "express";
import UserModel from "../models/user.model";
import WalletSrv from '../services/wallet.service';
import { TransI } from "../interfaces/interfaces";
import TransController from './transaction..control';

class WalletController extends BaseService {
    public async WalletBalance(req: Request, res: Response) {
        try {
            const user = await UserModel.findById(req.user._id, {wallet: true});
            if(user) {
                this.sendResponse(new BasicResponse(Status.SUCCESS, { msg: 'User Wallet', data: user}), req, res);
            } else {
                this.sendResponse(new BasicResponse(Status.UNPROCESSABLE_ENTRY, { msg: 'User not found', data: user}), req, res);
            }
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);
        }
    }
    public FundWallet(data: {email: string, currency: string, amount: number}): Promise<any> {
        const {email, currency, amount} = data
        const promise = new Promise(async (resolve, reject) => {
            console.log('===Fund Wallet===');
            if(email && currency && amount) {
                console.log(data);
                const result = UserModel.findOneAndUpdate(
                    { email: email , 'wallet.symbol': {$eq:currency.toUpperCase()}}, 
                    { $inc: {'wallet.$.balance': amount}});
                resolve(result);
            } else {
                reject('email, currency, balance is required')
            }
        }) 
        return promise;
    }
    public DebitWallet(data: {email: string, amount: number, currency: string, type: 'withdraw'|'exchange'}): Promise<any> {
        const {email, amount, currency, type} = data;
        const promise = new Promise(async (resolve, reject) => {
            console.log('===Debit Wallet===');            
            const findUser = (await UserModel.findOne({email}, {wallet: true}));
            if(!(findUser && findUser.toJSON().wallet && findUser.toJSON().wallet.length)) {
                reject(new BasicResponse(Status.NOT_FOUND, {msg:  'User Not Found or Empty Wallet'}));
                return;
            }
            const user = findUser.toJSON();
            const fee = WalletSrv.TransFerFee({amount, currency, type});                
            const selectedCun = user.wallet.find(cun => cun.symbol === currency);
            const totalAmount = Number(amount + fee);          
            if(!(selectedCun && (selectedCun.balance >= totalAmount))) {
                reject(new BasicResponse(Status.UNPROCESSABLE_ENTRY, {msg:  'Insufficient Fund'}));
                return; 
            }
            const result = await UserModel.findOneAndUpdate(
                { email: email , 'wallet.symbol': {$eq:currency.toUpperCase()}}, 
                { $inc: {'wallet.$.balance': -totalAmount}});
            resolve(result); 
        }) 
        return promise;
    }
    public async ExchangeCurrency(req: Request, res: Response) {
        try {
            const payload: any = {...req.body,  email: req.user.email, currency: req.body.payCun};
            const { email: userEmail, amount, payCun, recieveCun, currency } = payload;
            const minMaxCheck = WalletSrv.MinMaxAmount(currency, amount);            
            if(!minMaxCheck.status) {
                this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, {msg: minMaxCheck.msg}), req, res);
                return;
            }
            await this.DebitWallet({...payload, type: 'exchange'});
            const exchangeRate = await WalletSrv.ExchangeRate({recieveCun, payCun});
            const TransData: TransI = {userEmail, amount, type: 'exchange', payCun, exchangeRate, recieveCun, status: 'pending', source: 'wallet'};
            const trans = await TransController.Create(TransData);
            const result = {data: trans, msg: 'User Exchange Successful'}
            this.sendResponse(new BasicResponse(Status.SUCCESS, result), req, res);
          } catch (error) {
            this.sendResponse(error, req, res);
          }
    }
    public async FetchWalletDetails(req: Request, res: Response) {
        try {
            const user: any = await UserModel.findOne({
                _id: req.user._id,
                'wallet.symbol': {$eq: req.params.currency}
            }, {'wallet': {$elemMatch: {symbol: req.params.currency}}});
            if(user) {
                const details = user.wallet ? user.wallet[0] : user;                 
                this.sendResponse(new BasicResponse(Status.SUCCESS, { msg: 'User Wallet Detail', data: details}), req, res);
            } else {
                this.sendResponse(new BasicResponse(Status.UNPROCESSABLE_ENTRY, { msg: 'User not found', data: user}), req, res);
            }
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);
        }
    }
    public async ValidateTransCunAmount(req: Request, res: Response) {
        try {
            const { currency, amount, type } = req.body;
            const minMaxCheck = WalletSrv.MinMaxAmount(currency, amount); 
            if(!minMaxCheck.status) {
                this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, {msg: minMaxCheck.msg}), req, res);
                return;
            }
            this.sendResponse(new BasicResponse(Status.SUCCESS, {msg: 'currency amount valid'}), req, res);
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);
        }
    }
    public async WithdrawCurrency(req: Request, res: Response) {
        try {
            const payload: any = {...req.body,  email: req.user.email, currency: req.body.recieveCun};
            const { email: userEmail, amount, recieveCun, currency } = payload;
            const minMaxCheck = WalletSrv.MinMaxAmount(currency, amount);            
            if(!minMaxCheck.status) {
                this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, {msg: minMaxCheck.msg}), req, res);
                return;
            }
            const user: any = await UserModel.findOne({_id: req.user._id}, '+pin');
            const validateUserPin =  compareSync(req.body.pin, user.pin)
            if(!validateUserPin) {
                this.sendResponse(new BasicResponse(Status.FORBIDDEN, {msg: 'Incorrect Pin'}), req, res);
                return;
            }
            await this.DebitWallet({...payload, type: 'withdraw'});
            const TransData: TransI = {userEmail, amount, type: "withdraw", recieveCun, status: 'pending', source: "bank-transfer"};
            const trans = await TransController.Create(TransData);
            const result = {data: trans, msg: 'User Withdraw Successful'}
            this.sendResponse(new BasicResponse(Status.SUCCESS, result), req, res);
          } catch (error) {
            this.sendResponse(error, req, res);
          }
    }


}
export default new WalletController;