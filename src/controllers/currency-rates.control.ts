import { Status } from './../dtos/enums/statusenums';
import { BaseService } from "../services/base.service";
import CunRatesModel from '../models/currency-rate.model';
import { NextFunction, Request, Response } from "express";
import { BasicResponse } from "../dtos/outputs/basicresponse";
import CurrencyData  from '../datas/currency'



class CunRatesController extends BaseService {
   public async AddCunRate(req: Request, res: Response) {
       try {
           const payload = req.body;
           const allCun = CurrencyData.getAll();
           let responseObj = null
           if(allCun.findIndex(cun => cun.symbol === payload.currency) >= 0) {
               const rates = payload.rates;
               if(rates && Array.isArray(rates) && rates.findIndex(rate => rate.currency === payload.currency) === -1) {
                const cun = await CunRatesModel.create({...payload})
                responseObj = new BasicResponse(Status.SUCCESS, {data: cun})
               } else {
                responseObj = new BasicResponse(Status.PRECONDITION_FAILED, {msg: 'currency name cannot be among rates'}) 
               }
           } else {
            responseObj = new BasicResponse(Status.UNPROCESSABLE_ENTRY, {msg: 'currency not valid'})  
           }
           this.sendResponse(responseObj, req, res)
       } catch (error) {
          this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);   
       }
   }
   public async UpdateCunRate(req: Request, res: Response) {
        try {
            const payload = req.body;
            const currency = req.params.currency
            const allCun = CurrencyData.getAll();
            let responseObj = null             
            if(allCun.findIndex(cun => cun.symbol === currency) >= 0) {
                const rates = payload.rates;
                if(rates && Array.isArray(rates) && rates.findIndex(rate => rate.currency === currency) === -1) {
                const cun = await CunRatesModel.findOneAndUpdate({currency}, {rates: [...payload.rates]}, {new: true})
                responseObj = new BasicResponse(Status.SUCCESS, {data: cun})
                } else {
                responseObj = new BasicResponse(Status.PRECONDITION_FAILED, {msg: 'currency name cannot be among rates'}) 
                }
            } else {
            responseObj = new BasicResponse(Status.UNPROCESSABLE_ENTRY, {msg: 'currency not valid'})  
            }
            this.sendResponse(responseObj, req, res)
        } catch (error) {
        this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);   
        }
   }
   public async GetCunRate(req: Request, res: Response) {
    try {
        const cun = await CunRatesModel.findOne({currency: req.params.currency});
        this.sendResponse(new BasicResponse(Status.SUCCESS, {data:cun}), req, res);   
    } catch (error) {
        this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);   
    }
   }
}
export default new CunRatesController;