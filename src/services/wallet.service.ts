import axios from 'axios';
const currencyUrl = 'https://free.currconv.com/api/v7'
import env from '../environment/env';
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
   async stripeCharge(currency: string, amount: number){
        try {            
            const convertTo = `${this.base}_${currency}`.toUpperCase();
            const {data} = await axios.get(`${currencyUrl}/convert?q=${convertTo}&compact=ultra&apiKey=${env.currencyApiKey}`);
            const rate = this.roundToTwo(amount/data[convertTo]);
            let charge = (0.03 * rate)+(rate+0.5)
            if(this.base!==currency.toUpperCase()) {
                charge = (charge * data[convertTo]);
                charge = (charge * 0.022)+charge; 
            }
            return this.roundToTwo(charge);
        } catch (error) {
            return error
        }
    }
    roundToTwo(num: number) {    
        return +(Math.round((num) as any));
    }
}

export default new WalletService;