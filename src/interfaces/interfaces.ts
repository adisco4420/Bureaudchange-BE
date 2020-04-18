
export interface IUser {
    firstName?: String,
    lastName?: String,
    email?: String,
    password?: String,
}
export interface TransI {
    userEmail: String,
    type: 'withdraw' | 'deposit'| 'exchange',
    status: 'pending'| 'success'|'falied',
    source: 'card' | 'bank-transfer' | 'wallet',
    recieveCun?: String,
    payCun?: String,
    amount: number,
    date?: Date
}