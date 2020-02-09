import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "../controllers/base";
import { UserController} from '../controllers/user'
import Joi from '../middlewares/validator';
import UserVtor from '../validations/user'
export class UserRoute extends BaseController {
  constructor() {
    super();
  }

  public loadRoutes(prefix: String, router: Router) {
    this.initRegister(prefix, router);
    this.initLogin(prefix, router);
  }
    public initRegister(prefix: String, router: Router): any { 
      router.post(prefix + "/register", Joi.vdtor(UserVtor.Register), (req, res: Response, next: NextFunction) => {
       new UserController().Register(req, res, next)
      })
    }
    public initLogin(prefix: String, router: Router): any { 
      router.post(prefix + "/login", Joi.vdtor(UserVtor.Login), (req, res: Response, next: NextFunction) => {
       new UserController().Login(req, res, next)
      })
    }

}

