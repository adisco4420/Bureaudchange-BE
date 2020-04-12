import { NextFunction, Request, Response, Router } from "express";
import FndWltController from '../controllers/fund-wallet.control';
import FdWalletVtor from '../validations/fund-wallet.validator';
import Joi from '../middlewares/validator.midware';
import AuthMidWare from '../middlewares/auth.midware';


class FundWalletRoute {
    public loadRoutes(prefix: String, router: Router) {
        this.getStripeSessionId(prefix, router)
        this.stripeSesWebhook(prefix, router);
        this.flutterwaveWebhook(prefix, router);
    }

    private getStripeSessionId(prefix: String, router: Router) {
        router.post(prefix + '/get-stripe-session-id', Joi.vdtor(FdWalletVtor.getStripeSesId), AuthMidWare,  (req: Request, res: Response) => {
            FndWltController.getStripeSessionId(req, res)
        })
    }

    private stripeSesWebhook(prefix: String, router: Router) {
        router.post(prefix + '/stripe-session-webhook', (req: Request, res: Response) => {
            FndWltController.StripeSesWebHook(req, res)
        })
    }
    private flutterwaveWebhook(prefix: String, router: Router) {
        router.post(prefix + '/flutterwave-webhook', (req: Request, res: Response) => {
            FndWltController.FlutterwaveWebhook(req, res)
        })
    }
}

export default new FundWalletRoute;