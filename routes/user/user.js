const express = require('express');
const router = express.Router();
const controller = require('../../controller/user/Cuser');

// 회원가입 페이지
// router.get('/register', controller.registerPage);

// 회원가입 로직
router.post('/register', controller.userRegister);

// 로그인 페이지
// router.get('/login', controller.loginPage);

// 로그인 로직
router.post('/login', controller.userLogin);

// 로그인 아이디 중복 체크
router.post('/checkLoginid', controller.checkDuplicatedLoginid);

// 회원 정보 수정, userId 지우기
// router.patch('/', controller.updateUser);
router.patch('/:userId', controller.updateUser);

// 회원 조회
// router.get('/:userId', controller.getUser);

// 로그아웃 로직
router.get('/logout', controller.userLogout);

// 마이페이지 이동
// router.get('/profile', controller.getProfilePage);

module.exports = router;
