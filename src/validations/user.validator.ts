import * as joi from 'joi'

class UserValidator {
    public Register = {
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        phoneNumber: joi.number().required(),
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
}
export default new UserValidator()