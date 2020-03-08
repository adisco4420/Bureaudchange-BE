import { NextFunction, Request, Response, Router } from "express";
import FndWltController from '../controllers/fund-wallet.control';

class FundWalletRoute {
    public loadRoutes(prefix: String, router: Router) {
        this.getStripeSessionId(prefix, router)
    }

    private getStripeSessionId(prefix: String, router: Router) {
        router.post(prefix + '/get-stripe-session-id', (req: Request, res: Response) => {
            FndWltController.getStripeSessionId(req, res)
        })
    }
}

export default new FundWalletRoute;