
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
        type: String,
        minlength: 5,
        maxlength: 5
    },
    wallet: [{
        name: {type: String, default: 'Naira', unique: true},
        balance: {type: Number, default: 0},
        symbol: {type: String, default: 'NGN', unique: true},
        sign: {type: String, default: '₦', unique: true}
    }]
});
const UserModel = model('users', UserSchema)
export default UserModel