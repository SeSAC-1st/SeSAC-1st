const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, '../.env'),
}); 

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false, // 권장 설정: true로 하면 로그인하지 않아도 세션이 생성됨
    cookie: { 
        secure: false , // 개발 중에는 false, 프로덕션에서는 true로 설정
        httpOnly: true, // 클라이언트에서 쿠키에 접근하지 못하도록 설정
        maxAge: 1000 * 60 * 60 * 24 // 쿠키 유효기간 설정 (예: 1일)
    } 
})

module.exports = sessionMiddleware;