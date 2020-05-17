
import * as mongoose from "mongoose";

export let UserSchema = new mongoose.Schema({
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
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean, 
        default: false
    },
    isAdmin: {
        type: Boolean, 
        default: false
    },
    createdAt: { 
        type: Date,
        default: new Date()
    },
    pin: {
        type: String,
        minlength: 5,
        maxlength: 5, 
        select: false
    },
    referenceCode: {
        type: String,
        minlength: 10,
        select: false,
    },
    wallet: {
        type: [{
            name: {type: String, default: 'Naira'},
            balance: {type: Number, default: 0},
            symbol: {type: String, default: 'NGN'},
            sign: {type: String, default: '₦'},
        }],
        select: false
    },
    address: {
        type: {
            street: {type: String, default: ''},
            city: {type: String, default: ''},
            state: {type: String, default: ''},
            postalcode: {type: String, default: ''},
            country: {type: String, default: ''},
        },
        select: false
    },
    bankAccounts: {
        type: [{
            currency: {type: String},
            bankName: {type: String},
            accountNo: {type: String},
            accountName: {type: String}
        }],
        select: false
    }
});

const UserModel = mongoose.model('users', UserSchema)
export default UserModel