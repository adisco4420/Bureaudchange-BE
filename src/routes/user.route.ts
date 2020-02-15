import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "../controllers/base.control";
import UserController from '../controllers/user.control'
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
    this.initLogin(prefix, router);
  }
    private initRegister(prefix: String, router: Router): any { 
      router.post(prefix + "/register", Joi.vdtor(UserVtor.Register), (req, res: Response, next: NextFunction) => {
        UserController.Register(req, res, next)
      })
    }
    private initConfirm(prefix: String, router: Router): any { 
      router.get(prefix + "/comfirm-email", AuthMidWare, (req, res: Response) => {
        UserController.Confirm(req, res)
      })
    }
    private initResendEmail(prefix: String, router: Router): any { 
      router.post(prefix + "/resend-email", (req, res: Response) => {
        UserController.ResendEmail(req, res)
      })
    }
    private initLogin(prefix: String, router: Router): any { 
      router.post(prefix + "/login", Joi.vdtor(UserVtor.Login), (req, res: Response, next: NextFunction) => {
        UserController.Login(req, res, next)
      })
    }

}

