const { User }= require('../../models/user/User');

// 회원가입 페이지 렌더링
exports.registerPage = (req, res) => {
    res.render('user/registerPage');
}