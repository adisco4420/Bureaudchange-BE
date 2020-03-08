import TokenService from '../services/token.service';
import { Status } from '../dtos/enums/statusenums';
import { BaseService } from '../services/base.service';
import { BasicResponse } from '../dtos/outputs/basicresponse';

class AuthMidWare extends BaseService {
    auth() {
        return (req, res, next) => {   
            console.log(req.url);
            try {
                const authHeader = req.headers.authorization;
                if(!authHeader) return this.sendResponse(new BasicResponse(Status.UN_AUTHORIZED, {msg:'Please specify authorization header'}), req, res);
                const token = authHeader.split(' ')[1];
                const tokenData = TokenService.verify(token);
                if(req.url.includes('/user/confirm-email') || tokenData.isVerified) {                    
                    req.user = tokenData;
                    next();
                } else {
                    return this.sendResponse(new BasicResponse(Status.UN_AUTHORIZED, {msg:'you are not authorized unverified'}), req, res)
                }
            } catch (error) {
               return this.sendResponse(new BasicResponse(Status.UN_AUTHORIZED, {msg:'you are not authorized'}), req, res)
            }
        }
    }
}
export default new AuthMidWare().auth()