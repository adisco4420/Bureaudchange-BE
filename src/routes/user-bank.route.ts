import { Request, Response, Router } from "express";
import Joi from '../middlewares/validator.midware';
import UserVtor from '../validations/user.validator'
import AuthMidWare from '../middlewares/auth.midware';
import UserBankController from '../controllers/user-bank.control';


class UserBankRoute{
    public loadRoutes(prefix: String, router: Router) {
        this.Add(prefix, router);
        this.GetAll(prefix, router);
        this.Update(prefix, router);
        this.Delete(prefix, router);
    }
    private Add(prefix: String, router: Router) {
        router.post(prefix+'/add', Joi.vdtor(UserVtor.BankSetup), AuthMidWare, (req: Request, res: Response) => {
            UserBankController.Add(req, res);
        })
    }
    private GetAll(prefix: String, router: Router) {
        router.get(prefix+'/all', AuthMidWare, (req: Request, res: Response) => {
            UserBankController.GetAll(req, res);
        })  
    }
    private Update(prefix: String, router: Router) {
        router.patch(prefix+'/update', Joi.vdtor(UserVtor.BankSetup), AuthMidWare, (req: Request, res: Response) => {
            UserBankController.Update(req, res);
        })  
    }
    private Delete(prefix: String, router: Router) {
        router.delete(prefix+'/delete/:currency', AuthMidWare, (req: Request, res: Response) => {
            UserBankController.Delete(req, res);
        })  
    }
}

export default new UserBankRoute;