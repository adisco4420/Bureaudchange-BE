import * as joi from 'joi'

class FundWalletValidator {
    public getStripeSesId = {
        name: joi.string().required(),
        amount: joi.number().required(),
        currency: joi.string().required(),
        success_url: joi.string().required(),
        cancel_url: joi.string().required()
    }
}
export default new FundWalletValidator()