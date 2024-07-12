const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, '../.env'),
}); 

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // 개발 중에는 false, 프로덕션에서는 true로 설정
})

module.exports = sessionMiddleware;