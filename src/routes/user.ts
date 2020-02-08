import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "../controllers/base";
import { UserController} from '../controllers/user'

export class UserRoute extends BaseController {
  constructor() {
    super();
  }

  public loadRoutes(prefix: String, router: Router) {
    this.initRegister(prefix, router);
  }
    public initRegister(prefix: String, router: Router): any { 
      router.post(prefix + "/register", (req, res: Response, next: NextFunction) => {
       new UserController().Register(req, res, next)
      })
    }

}

