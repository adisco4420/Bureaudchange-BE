import { BaseService } from "../services/base.service";
import { BasicResponse } from "../dtos/outputs/basicresponse";
import { Status } from '../dtos/enums/statusenums';
import { NextFunction, Request, Response } from "express";
import env from '../environment/env';

const stripe = require('stripe')(env.stripeTestKey);


class FundWalletController extends BaseService {
    public async getStripeSessionId(req: Request, res: Response) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                  name: 'T-shirt',
                  description: 'Comfortable cotton t-shirt',
                  images: ['https://example.com/t-shirt.png'],
                  amount: 500,
                  currency: 'usd',
                  quantity: 1,
                }],
                success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'https://example.com/cancel',
              });
              this.sendResponse(new BasicResponse(Status.SUCCESS, {session}), req, res);   
        } catch (error) {
            this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);   
        }
    }
    public async StripePay(){

    }
}
export default new FundWalletController;