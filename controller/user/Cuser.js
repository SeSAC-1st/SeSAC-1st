const { User } = require('../../models/index');
const { hashPw, comparePw } = require('../../utils/passwordUtils');

// 회원가입 페이지
exports.registerPage = (req, res) => {
    res.render('/user/registerPage');
};

/**
 * 사용자 등록을 처리하는 함수
 * @param {Object} req - 요청 객체
 * @param {Object} req.body - 요청 본문 데이터
 * @param {string} req.body.userName - 사용자의 이름 (한글, 영어로 2~10글자)
 * @param {string} req.body.loginId - 로그인 ID (6~10글자, 영어 대소문자, 숫자 포함)
 * @param {string} req.body.userPw - 사용자 비밀번호 (8~12글자, 영어, 숫자, 특수문자 포함)
 * @param {string} req.body.email - 사용자 이메일
 * @param {string} req.body.address - 사용자 주소
 * @param {string} req.body.userNick - 사용자 닉네임 (한글, 영어로 2~10글자)
 * @param {string} req.body.birthday - 사용자 생일 (YYYY-MM-DD 형식)
 * @param {Object} res - 응답 객체
 * @returns {Promise<void>} - 비동기 함수는 아무것도 반환하지 않습니다.
 */
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
         if (!userNameRegex.test(userName)) return res.status(400).json({ error: 'Invalid userName.' });

        // loginId 정규표현식 (6~10글자, 영어 대소문자, 숫자 포함)
        const loginIdRegex = /^[a-zA-Z0-9]{6,10}$/;
        if (!loginIdRegex.test(loginId)) return res.status(400).json({ error: 'Invalid loginId.' });

        // userPw 정규표현식 검사 (8~12글자, 영어, 숫자, 특수문자 포함)
        const userPwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
        if (!userPwRegex.test(userPw)) return res.status(400).json({ error: 'Invalid userPw.' });

        // userNick 정규표현식 검사 (한글, 영어로 2~10글자)
        const userNickRegex = /^[가-힣a-zA-Z]{2,10}$/;
        if (!userNickRegex.test(userNick)) return res.status(400).json({ error: 'Invalid userNick.' });

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

// 로그인 로직
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

// 로그인 session
exports.userLogin = async (req, res) => {
    try {
        console.log(req.body);
        const { loginId, userPw } = req.body;
        
        console.log('loginId ->', loginId);
        console.log('userPw ->', userPw);

        // 비밀번호 해싱
        // const hashedPw = hashPw(userPw);

        // 데이터베이스에서 사용자를 찾습니다.
        const user = await User.findOne({
            where: { loginId },
        });
        console.log('userId, userPw ->', user.loginId, user.userPw);

        if (!user) return res.status(404).json({ error: 'User not found.' });

        // 데이터베이스에 저장된 해시된 비밀번호와 입력된 비밀번호를 비교합니다.
        const isPasswordValid = comparePw(userPw, user.userPw);
        console.log('userPw, user.userPw ->', userPw, user.userPw)

        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password.' });

        req.session.user = {
            loginId : user.loginId,
            profileImg: user.profileImg,
            userNick: user.userNick
        }

        console.log(req.session.user);
    
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// 로그인 아이디 중복 체크
exports.checkDuplicatedLoginid = async (req, res) => {
    try {
        const { loginId } = req.body;
        console.log('duplicate loginId ->', loginId);

        const user = await User.findOne({
            where: { loginId },
        });

        // loginId가 이미 존재하는 경우
        if (user) return res.status(409).json({ error: 'Login ID is already in use.'});

        // loginId가 존재하지 않는 경우
        res.json({ message: 'Login ID is available.' });


    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

/**
 * 회원 정보를 수정하는 함수
 * @param {Object} req - 요청 객체
 * @param {Object} req.body - 요청 본문 데이터
 * @param {string} req.body.userId - 수정할 회원의 로그인 ID
 * @param {string} [req.body.userPw] - 새 비밀번호 (선택적)
 * @param {string} [req.body.userNick] - 새 닉네임 (선택적)
 * @param {string} [req.body.profileImg] - 새 프로필 이미지 (선택적)
 * @param {Object} res - 응답 객체
 * @returns {Promise<void>} - 비동기 함수는 아무것도 반환하지 않습니다.
 */
// 회원 정보 수정
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params; // URL 경로에서 userId 추출
        const { email, address, profileImg, userNick } = req.body;
        console.log('Updating user info for userId ->', userId);

        const user = await User.findOne({
            where: { userId },
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        // 업데이트할 데이터 객체 생성
        const updatedData = {};
        if (email) updatedData.email = email;
        if (address) updatedData.address = address;
        if (profileImg) updatedData.profileImg = profileImg;
        if (userNick) updatedData.userNick = userNick;

        await User.update(updatedData, {
            where: { userId },
        });

        const updatedUser = await User.findOne({
            where: { userId },
        });

        res.json(updatedUser);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


// 회원 조회
exports.getUser = async (req, res) => {
    const { userId } = req.params; // URL 경로에서 userId 추출
    console.log('Searching user info for userId ->', userId);

    const user = await User.findOne({
        where: { userId },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
}

// 로그아웃 로직
exports.userLogout = async (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Failed to logout.');

        res.send('Logged out successfully.');
    });
}