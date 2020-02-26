import { Model} from 'mongoose';

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
} 
export default new ModelHelper;