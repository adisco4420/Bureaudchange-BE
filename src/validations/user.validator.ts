import * as joi from 'joi';
import currencyData from '../datas/currency';
const cunSymbol = currencyData.getAllSymbol();

class UserValidator {
    public Register = {
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        phoneNumber: joi.string().required(),
        password: joi.string().required(),
        baseUrl: joi.string().required()
    }
    public Login =  {
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        password: joi.required()
    }      
    public WalletSetup = {
        name: joi.string().required(),
        symbol: joi.string().required(),
        sign: joi.string().required(),
    };
    public PinSetup = {
        pin: joi.string().min(5).max(5).required()
    }
    public Exchange = {
        amount: joi.number().required(), 
        payCun: joi.string().required().valid([...cunSymbol]), 
        recieveCun: joi.string().required().valid([...cunSymbol]),
    }
    public EditProfile = {
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        phoneNumber: joi.string().required(),
        address: joi.object({
            street: joi.string().required(),
            city: joi.string().required(),
            state: joi.string().required(),
            postalcode: joi.string().required(),
            country: joi.string().required(),
        }).required()  
    }
    public BankSetup = {
        currency: joi.string().required().valid([...cunSymbol]),
        bankName: joi.string().required(),
        accountNo: joi.string().required(),
        accountName: joi.string().required()
    }
}
export default new UserValidator()