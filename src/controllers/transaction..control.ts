import { Status } from './../dtos/enums/statusenums';
import { BaseService } from "../services/base.service";
import { NextFunction, Request, Response } from "express";
import { TransI } from '../interfaces/interfaces';
import TransModel from '../models/transaction.model';

class TransactionController extends BaseService {
    Create(payload: TransI): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            const {amount, userEmail, type, status} = payload
            if(payload && amount && userEmail && type && status) {
                const result = TransModel.create({...payload});
                resolve(result);
            } else {
                reject('payload=>{userEmail, amount, type, status} --> are required');
            }
        });
        return promise; 
    } 
    Update() {
        const data = {}
        // this.Create({type: 'withdraw', status})
    }
}

export default new TransactionController;