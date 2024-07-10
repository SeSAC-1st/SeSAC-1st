const { User } = require('../../models/index');

// 회원가입 페이지
exports.registerPage = (req, res) => {
    res.render('/user/registerPage');
  };

// 회원가입 로직
exports.userRegister = async (req, res) => {
    try {
        console.log('User ->', User);
        console.log(req.body)
        const {
            userName, loginId, userPw, email, address, profileImg, userNick, birthday
        } = req.body;
        const newUser = await User.create({
            userName, loginId, userPw, email, address, profileImg, userNick, birthday
        });

        res.json(newUser);
        console.log(newUser)
        // {
        //     "userId": 1,
        //     "userName": "ranis",
        //     "loginId": "ranikuns",
        //     "userPw": "rani12345",
        //     "email": "rani@gamil.com",
        //     "address": "seoul",
        //     "profileImg": "cat",
        //     "userNick": "babocat",
        //     "birthday": "1998-06-15",
        //     "updatedAt": "2024-07-10T08:34:58.834Z",
        //     "createdAt": "2024-07-10T08:34:58.834Z"
        // }
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
        const { loginId, userPw } = req.body;
        
        
        console.log('loginId ->', loginId);

        if (loginId === undefined) {
            throw new Error('loginId가 정의되지 않았습니다.');
        }

        const user = await User.findOne({
            where: { loginId, userPw },
        });

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// 로그아웃 페이지

// 로그아웃 로직
