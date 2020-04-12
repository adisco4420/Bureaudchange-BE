import { Status } from "../enums/statusenums";
import { Document } from "mongoose";

interface DataI {
    msg?: string;
    data?:  Document | any[] | string
}

export class BasicResponse {

    private status: number;
    private data: object;

    constructor(status: number, data ?: DataI){
        this.status = status;
        this.data = data;        
    }
    public getData(){
        return this.data
    }

    public getStatusString() {              
        return Status[this.status];
    }
    
}