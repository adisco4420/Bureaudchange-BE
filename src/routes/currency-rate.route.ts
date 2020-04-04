import { Router, Request, Response } from "express";
import CunRatesControl from '../controllers/currency-rates.control';


class CunRatesRoute {
    public loadRoutes(prefix: String, router: Router) {
        this.addCunRate(prefix, router);
        this.getCunRate(prefix, router);
        this.updateCunRate(prefix, router)
    }
    public addCunRate(prefix: String, router: Router) {
        router.post(prefix + '/add', (req: Request, res: Response) => {
            CunRatesControl.AddCunRate(req, res)
        })
    }
    public getCunRate(prefix: String, router: Router){
        router.get(prefix + '/get/:currency', (req: Request, res: Response) => {
            CunRatesControl.GetCunRate(req, res)
        })
    }
    public updateCunRate(prefix: String, router: Router){
        router.patch(prefix + '/update/:currency', (req: Request, res: Response) => {
            CunRatesControl.UpdateCunRate(req, res)
        })
    }
}

export default new CunRatesRoute