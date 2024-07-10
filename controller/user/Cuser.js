const { User } = require('../../models/user/User');

// 회원가입 페이지
exports.registerPage = (req, res) => {
    res.render('/user/registerPage');
  };

// 회원가입 로직
exports.userRegister = async (req, res) => {
    try {
        console.log(req.body)
        const {
            userName, loginId, userPw, email, address, profileImg, userNick, birthday
        } = req.body;
        const newUser = await User.create({
            userName, loginId, userPw, email, address, profileImg, userNick, birthday
        });

        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// 로그인 페이지
exports.loginPage = (req, res) => {
    res.render('/user/loginPage');
}

// 로그인 로직
exports.userLogin = async (req, res) => {
    try {
        console.log(req.body);
        const { userid, userPw } =req.body;
        
        const user = await User.findOne({
            where: { userid, userPw },
        });

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// 로그아웃 페이지

// 로그아웃 로직
