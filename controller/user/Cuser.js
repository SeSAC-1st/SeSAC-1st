const { User } = require('../../models/index');
const { hashPw, comparePw } = require('../../utils/bcrypt');

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
            userName, loginId, userPw, email, address, userNick, birthday
        } = req.body;

         // userName 정규표현식 검사 (한글, 영어로 2~10글자)
         const userNameRegex = /^[가-힣a-zA-Z]{2,10}$/;
         if (!userNameRegex.test(userName)) {
             return res.status(400).json({ error: 'Invalid userName.' });
         }

        // loginId 정규표현식 (6~10글자, 영어 대소문자, 숫자 포함)
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
            return res.status(400).json({ error: 'Invalid userNick.' });
        }

        // 비밀번호 해싱
        const hashedPw = hashPw(userPw);

        const newUser = await User.create({
            userName, loginId, userPw: hashedPw, email, address, userNick, birthday
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


/**
 * 사용자의 로그인 요청을 처리합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.loginId - 사용자의 로그인 아이디 (6~10글자, 영어 대소문자)
 * @param {string} req.body.userPw - 사용자의 비밀번호 (8~12글자, 영어, 숫자, 특수문자 포함)
 * @param {Object} res - Express 응답 객체
 * @returns {Promise<void>} - 비동기 함수이므로 Promise를 반환합니다.
 */

// 로그인 로직

// 로그인 암호화 DB 대조
// 로그인 session
exports.userLogin = async (req, res) => {
    try {
        console.log(req.body);
        const { loginId, userPw } = req.body;
        
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
        console.log('loginId ->', loginId);
        console.log('userPw ->', userPw);

        // 비밀번호 해싱
        const hashedPw = hashPw(userPw);

        const comparedPw = comparePw()

        const user = await User.findOne({
            where: { loginId, userPw:hashedPw },
        });

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

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
