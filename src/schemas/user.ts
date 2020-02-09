
import { Schema, model } from "mongoose";

export let UserSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true
        },
    lastName: {
        type: String,
        required: true
        },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        },
    password: {
        type: String,
        required: true,
        select: false
        },
    phoneNumber: {
        type: Number,
        required: true
    },
    isVerified: {
        type: Boolean, 
        default: false
    },
    createdAt: { 
        type: Date,
        default: new Date()
    },
    bvnNumber: {
        type: Number,
    },
    pin: {
        type: Number,
    },
    wallet: [{
        name: {type: String, default: 'Naira'},
        balance: {type: Number, default: 0},
        symbol: {type: String, default: 'NGN'},
        sign: {type: String, default: '₦'}
    }]
});
const UserModel = model('users', UserSchema)
export default UserModel