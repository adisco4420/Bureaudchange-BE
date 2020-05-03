import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "../controllers/base.control";
import UserController from '../controllers/user.control';
import WalletController from '../controllers/wallet.control';
import Joi from '../middlewares/validator.midware';
import UserVtor from '../validations/user.validator'
import AuthMidWare from '../middlewares/auth.midware';

export class UserRoute extends BaseController {
  constructor() { 
    super();
  }

  public loadRoutes(prefix: String, router: Router) {
    this.initRegister(prefix, router);
    this.initConfirm(prefix, router);
    this.initResendEmail(prefix, router);
    this.initWalletSetup(prefix, router);
    this.initPinSetup(prefix, router);
    this.initLogin(prefix, router);
    this.initProfile(prefix, router);
    this.initWalletBalance(prefix, router);
    this.initExchangeCurrency(prefix, router);
    this.initEditProfile(prefix, router);
  }
    private initRegister(prefix: String, router: Router): any { 
      router.post(prefix + "/register", Joi.vdtor(UserVtor.Register), (req, res: Response, next: NextFunction) => {
        UserController.Register(req, res, next)
      })
    }
    private initConfirm(prefix: String, router: Router): any { 
      router.get(prefix + "/confirm-email", AuthMidWare, (req, res: Response) => {
        UserController.Confirm(req, res)
      })
    }
    private initResendEmail(prefix: String, router: Router): any { 
      router.post(prefix + "/resend-email", (req, res: Response) => {
        UserController.ResendEmail(req, res)
      })
    }
    private initWalletSetup(prefix: String, router: Router): any { 
      router.patch(prefix + "/wallet-setup", Joi.vdtor(UserVtor.WalletSetup), AuthMidWare, (req, res: Response) => {
        UserController.WalletSetup(req, res)
      })
    }
    private initPinSetup(prefix: String, router: Router): any { 
      router.patch(prefix + "/pin-setup", Joi.vdtor(UserVtor.PinSetup), AuthMidWare, (req, res: Response) => {
        UserController.PinSetup(req, res)
      })
    }
    private initLogin(prefix: String, router: Router): any { 
      router.post(prefix + "/login", Joi.vdtor(UserVtor.Login), (req, res: Response, next: NextFunction) => {
        UserController.Login(req, res, next)
      })
    }
    private initProfile(prefix: String, router: Router): any { 
      router.get(prefix + "/profile", AuthMidWare, (req, res: Response) => {
        UserController.Profile(req, res)
      })
    }
    private initEditProfile(prefix: String, router: Router): any { 
      router.patch(prefix + "/edit-profile", Joi.vdtor(UserVtor.EditProfile), AuthMidWare, (req, res: Response) => {
        UserController.EditProfile(req, res)
      })
    }
    private initWalletBalance(prefix: String, router: Router): any { 
      router.get(prefix + "/wallet-balance",  AuthMidWare, (req, res: Response) => {
        WalletController.WalletBalance(req, res)
      })
    }
    private initExchangeCurrency(prefix: String, router: Router): any { 
      router.post(prefix + "/exchange",Joi.vdtor(UserVtor.Exchange), AuthMidWare, async (req: Request, res: Response) => {
        WalletController.ExchangeCurrency(req, res)
      })
    }

}

