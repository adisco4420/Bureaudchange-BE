import { BaseService } from "../services/base.service";
import { BasicResponse } from "../dtos/outputs/basicresponse";
import { Status } from '../dtos/enums/statusenums';
import { Request, Response } from "express";
import env from '../environment/env';
import WalletSrv from '../services/wallet.service';
import WalletController from './wallet.control';
import TransController from './transaction..control';
import { TransI } from "../interfaces/interfaces";

const stripe = require('stripe')(env.stripeTestKey);


class FundWalletController extends BaseService {
    public async getStripeSessionId(req: Request, res: Response) {
        try {
            const payload = req.body;
            const currency = payload.currency.toLowerCase()
            const {amount} = await WalletSrv.stripeCharge(currency, payload.amount);
            if(!amount) return;

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
        const { data } = req.body
        const {currency} = data.object.display_items[0];  
        const amount = WalletSrv.trasactions[data.object.id];        
        const fundWalletData = {email: data.object.customer_email, amount, currency};
        const TransData: TransI = {
            userEmail: fundWalletData.email, type: 'deposit',
            source: 'card', payCun: currency, amount,
            status: 'success',
        }
        if(!amount) {
            this.sendResponse(new BasicResponse(Status.NOT_FOUND, {data: 'amount is not found'}), req, res); 
            return;
        }
        try {
            await WalletController.FundWallet(fundWalletData);
            const result = await TransController.Create({...TransData}); 
            delete WalletSrv.trasactions[data.object.id];
            this.sendResponse(new BasicResponse(Status.SUCCESS, {data:result}), req, res);   
        } catch (error) {
            await TransController.Create({...TransData, status: 'falied'});
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);   
        }
    }
    public async FlutterwaveWebhook(req: Request, res: Response) {
        var hash = req.headers["verif-hash"];
        if(!hash) return;
        if(hash!==env.flutterwaveSecretHash) return;
        const { status, customer, currency , amount} = req.body;
        if(status !== 'successful') return;
        const fundWalletData = {email: customer.email, amount, currency};
        const TransData: TransI = {
            userEmail: customer.email, type: 'deposit',
            source: 'card', payCun: currency, amount,
            status: 'success',
        }
        try {
            await WalletController.FundWallet(fundWalletData);
            const result = await TransController.Create(TransData)
            this.sendResponse(new BasicResponse(Status.SUCCESS, {data:result}), req, res);   
        } catch (error) {
            await TransController.Create({...TransData, status: 'falied'});
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);   
        }


        // Give value to your customer but don't give any output
        // Remember that this is a call from rave's servers and 
        // Your customer is not seeing the response here at all

    }
}
export default new FundWalletController;