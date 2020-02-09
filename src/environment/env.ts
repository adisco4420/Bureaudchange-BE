const dotenv = require('dotenv');
dotenv.config()

const env = {
    MONGODB_URI : process.env.MONGODB_URI,
    MAILGUN_KEY: process.env.MAILGUN_KEY
}
export default env;