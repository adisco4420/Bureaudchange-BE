import { BaseService } from "../services/base.service";
import { BasicResponse } from "../dtos/outputs/basicresponse";
import { Status } from '../dtos/enums/statusenums';
import { NextFunction, Request, Response } from "express";
import env from '../environment/env';
import UserModel from '../models/user.model';
import WalletSrv from '../services/wallet.service';

const stripe = require('stripe')(env.stripeTestKey);


class FundWalletController extends BaseService {
    public async getStripeSessionId(req: Request, res: Response) {
        try {
            const payload = req.body;
            const currency = payload.currency.toLowerCase()
            const amount = await WalletSrv.stripeCharge(currency, payload.amount);
            console.log('converted', amount);
            const session = await stripe.checkout.sessions.create({
                customer_email: req.user.email,
                payment_method_types: ['card'],
                line_items: [{
                  name: payload.name,
                  amount: amount*100,
                  currency: payload.currency.toLowerCase(),
                  quantity: 1,
                }],
                success_url: payload.success_url+'?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: payload.cancel_url,
              });
              WalletSrv.saveTrans({sessionId: session.id, amount: payload.amount})
              this.sendResponse(new BasicResponse(Status.SUCCESS, {data:session}), req, res);   
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);   
        }
    }
    public async StripeSesWebHook(req: Request, res: Response) {
        console.log('====== Stripe Webhook =====');
        try {
            const { data } = req.body
            const {currency} = data.object.display_items[0];  
            const balance = WalletSrv.trasactions[data.object.id] 
            delete WalletSrv.trasactions[data.object.id]                  
            const result = await UserModel.findOneAndUpdate(
                { email: data.object.customer_email , 'wallet.symbol': {$eq:currency.toUpperCase()}}, 
                { $inc: {'wallet.$.balance': balance}}
            )
            this.sendResponse(new BasicResponse(Status.SUCCESS, {data:result}), req, res);   
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);   
        }
    }
}
export default new FundWalletController;