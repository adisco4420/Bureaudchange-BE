import { Router , Request, Response} from "express";
import TransController from '../controllers/transaction..control';
import AuthMidWare from '../middlewares/auth.midware';
import AdminMidWare from '../middlewares/admin.midware';

class TransRoute {
    public loadRoutes(prefix: String, router: Router) {
        this.Update(prefix, router);
        this.UserTrans(prefix, router);
        this.AllTrans(prefix, router);
    }
    private Update(prefix: String, router: Router){
        router.patch(prefix+'/update/:id/:status', AdminMidWare, (req: Request, res: Response) => {
            TransController.Update(req, res);
        })
    }
    private UserTrans(prefix: String, router: Router){
        router.get(prefix+'/user', AuthMidWare, (req: Request, res: Response) => {
            TransController.GetUserTrans(req, res);
        })
    }
    private AllTrans(prefix: String, router: Router){
        router.get(prefix+'/all', AdminMidWare, (req: Request, res: Response) => {
            TransController.GetAllTrans(req, res);
        })
    }

}
export default new TransRoute;