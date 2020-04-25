import * as mongoose from "mongoose";
import CurrencyData  from '../datas/currency'

const cunSymbols = CurrencyData.getAllSymbol();

const TransactionSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        lowercase: true,
    },
    type: {
        type: String,
        enum: ['deposit', 'withdraw', 'exchange'],
        required: true,
        lowercase: true,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'falied'],
        required: true,
        default: 'pending'
    },
    source: {
        type: String,
        enum: ['card', 'bank-transfer', 'wallet'],
        default: 'wallet',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    recieveCun: {
        type: String,
        enum: [...cunSymbols],
        uppercase: true,
    },
    payCun: {
        type: String,
        enum: [...cunSymbols],
        uppercase: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    exchangeRate: {
        type: Number,
        default: 0
    }
})
const TransactionModel = mongoose.model('transactions', TransactionSchema);
export default TransactionModel;