import * as joi from 'joi'

class UserValidator {
    public Register = {
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        phoneNumber: joi.number().required(),
        password: joi.required()
    }
    public Login =  {
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        password: joi.required()
    }
}
export default new UserValidator()