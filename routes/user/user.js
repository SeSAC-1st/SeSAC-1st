const express = require('express');
const router = express.Router();
const controller = require('../../controller/user/Cuser');

// 회원가입 페이지
router.get('/register', controller.registerPage);

// 회원가입 로직
router.post('/register', controller.userRegister);