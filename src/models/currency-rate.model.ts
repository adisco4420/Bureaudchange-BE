import * as mongoose from "mongoose";
import CurrencyData  from '../datas/currency'

const cunSymbols = CurrencyData.getAll().map(cun => cun.symbol);

const CunRatesSchema = new mongoose.Schema({
    currency: {
        type: String,
        enum: [...cunSymbols],
        required: true,
        uppercase: true,
        unique: true
    },
    rates: {
        type: [{
            currency: {type: String, default: 'CunName'},
            rate: {type: Number, default: 0}
        }],
        required: true
    }
})
const CunRatesModel = mongoose.model('currency_rates', CunRatesSchema)
export default CunRatesModel;