require('dotenv').config()

module.exports = {
    env: {
        'API_SERVER': process.env.API_SERVER,
        'SENDGRID_API_KEY': process.env.SENDGRID_API_KEY
    }
}