import { Model} from 'mongoose';
import UserModel from '../models/user.model';

class ModelHelper {
    async unique(modelx: Model<any>, object: {key: string, value: string}) {
        const {key, value} = object
        const res =  await modelx.findOne({[key]: value});        
        if(res) {
            return false
        } else {
            return true;
        }
    }
    async generateReference(userId: string) {
        const useridx = userId;
        const refCode = `KX${new Date().getTime().toString().substring(5)}`;
        const isUnique = await this.unique(UserModel, {key: 'referenceCode', value: refCode});
        if(isUnique) {
            await UserModel.findByIdAndUpdate(useridx, {'referenceCode': refCode}); 
            return refCode;
        } else {
            this.generateReference(useridx)
        }
    }
} 
export default new ModelHelper;