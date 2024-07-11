const { User } = require('../../models/index');
const { hashPw } = require('../../utils/bcrypt');

// 회원가입 페이지
exports.registerPage = (req, res) => {
    res.render('/user/registerPage');
  };

// 회원가입 로직
// 회원가입 암호화
exports.userRegister = async (req, res) => {
    try {
        console.log('User ->', User);
        console.log(req.body)
        const {
            userName, loginId, userPw, email, address, profileImg, userNick, birthday
        } = req.body;

         // userName 정규표현식 검사 (한글, 영어로 2~10글자)
         const userNameRegex = /^[가-힣a-zA-Z]{2,10}$/;
         if (!userNameRegex.test(userName)) {
             return res.status(400).json({ error: 'Invalid userName. It must be 2-10 characters long and include only Korean or English letters.' });
         }

        // loginId 정규표현식 (6~10글자, 영어 대소문자)
        const loginIdRegex = /^[a-zA-Z0-9]{6,10}$/;
        if (!loginIdRegex.test(loginId)) {
            return res.status(400).json({ error: 'Invalid loginId.' });
        }

        // userPw 정규표현식 검사 (8~12글자, 영어, 숫자, 특수문자 포함)
        const userPwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
        if (!userPwRegex.test(userPw)) {
            return res.status(400).json({ error: 'Invalid userPw.' });
        }

        // userNick 정규표현식 검사 (한글, 영어로 2~10글자)
        const userNickRegex = /^[가-힣a-zA-Z]{2,10}$/;
        if (!userNickRegex.test(userNick)) {
            return res.status(400).json({ error: 'Invalid userNick. It must be 2-10 characters long and include only Korean or English letters.' });
        }

        // 비밀번호 해싱
        const hashedPw = hashPw(userPw);

        const newUser = await User.create({
            userName, loginId, userPw: hashedPw, email, address, profileImg, userNick, birthday
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

// 로그인 정규표현식
// 로그인 암호화
// 로그인 암호화 DB 대조
// 로그인 session
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
