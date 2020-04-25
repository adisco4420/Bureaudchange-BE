import axios from 'axios';
const currencyUrl = 'https://free.currconv.com/api/v7'
import env from '../environment/env';
import CunModel from '../models/currency-rate.model';
class WalletService {
    private base = 'GBP';
    public trasactions: {sessionId?: string, amount?: number} = {}
    constructor() {}
    saveTrans({sessionId, amount}) {this.trasactions[sessionId]
        this.trasactions = {
            [sessionId]: amount,
            ...this.trasactions
        };
        console.log('save trans', this.trasactions);
        
    }
    stripeCharge(currency: string, amount: number): Promise<{amount: number}>{
        const promise = new Promise(async(resolve, reject) => {
        const convertTo = `${this.base}_${currency}`.toUpperCase();
        axios.get(`${currencyUrl}/convert?q=${convertTo}&compact=ultra&apiKey=${env.currencyApiKey}`)
            .then(res => {
                const {data} = res;
                const rate = this.roundToTwo(amount/data[convertTo]);
                let charge = (0.03 * rate)+(rate+0.5)
                if(this.base!==currency.toUpperCase()) {
                    charge = (charge * data[convertTo]);
                    charge = (charge * 0.022)+charge; 
                }
                resolve({amount: this.roundToTwo(charge)})
            })
            .catch(err => {
                reject(err.response.data)
            })
       })
       return (promise as Promise<{amount: number}>)
    }
    TransRate(payload: {recieveCun: String, payCun: String}): Promise<any> {
        const { payCun, recieveCun} = payload;
        const promise = new Promise(async (resolve, reject) => {
            const cunRates = await CunModel.findOne({currency:  payCun});
            if(!cunRates) return reject('currency not found')
            const cunRatejson = cunRates.toJSON();
            const transRate = cunRatejson.rates.find(rate => rate.currency === recieveCun);
            resolve(transRate.rate)
        })
        return promise;
    }
    MinMaxAmount(currency: String, amount: number): {status: boolean, msg: string} {
        let result = {status: true, min: '50', max: '500'}
        switch (currency) {
            case 'NGN':
                if(!(amount >= 20000 && amount <= 200000)) result = {status: false, min: '20,000', max: '200,000'}
                break;
            case 'USD': case 'EUR': case 'GBP':
                if(!(amount >= 50 && amount <= 500)) result = {status: false, min: '50', max: '500'}
                break;
            case 'AED':
                if(!(amount >= 200 && amount <= 2000)) result = {status: false, min: '200', max: '2000'}
                break;
            case 'CNY':
                if(!(amount >= 5000 && amount <= 50000)) result = {status: false, min: '5,000', max: '50,000'}
                break;
            default:
                break;
        }
        const {status, min, max} = result;
        return {status: status, msg: `Minimum: ${min}, Maximum: ${max} ${currency}`}
    }
    TransFerFee(payload: {amount: number, currency: string}): number{
        const result = 0.001 * payload.amount;
        return Number(result);
    } 
    roundToTwo(num: number) {    
        return +(Math.round((num) as any));
    }
}

export default new WalletService;