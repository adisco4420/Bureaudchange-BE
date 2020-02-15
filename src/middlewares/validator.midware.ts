import * as joi from 'joi'
import { BaseService } from '../services/base.service'
import { Status } from '../dtos/enums/statusenums';
import { BasicResponse } from '../dtos/outputs/basicresponse';
/**
 * Validation middleware that uses joi to validate the request body.
 * @param schema Joi schema to use to validate the request body
 */
export class Joi extends BaseService {
  vdtor(schema) {
    return async (req, res, next) => {
      try {
            const result = await joi.validate(req.body, schema, {
              abortEarly: false,
            });
            next();
          } catch (err) {              
            const errorDetails = err.details.map(e => e.message);
            const response = {
              message: 'Some validation errors occured',
              errors: errorDetails,
            }   
           return this.sendResponse(new BasicResponse(Status.ERROR, response), req, res)
          }
        }; 
  }
}
const newJoi = new Joi()
export default newJoi;