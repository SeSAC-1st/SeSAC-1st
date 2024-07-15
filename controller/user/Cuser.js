const { User } = require('../../models/index');
const { hashPw, comparePw } = require('../../utils/passwordUtils');

// 회원가입 페이지
exports.registerPage = (req, res) => {
    res.render('user/registerPage');
  };

/**
 * 회원가입
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
    const { userName, loginId, userPw, email, address, userNick, birthday } =
      req.body;

    // userName 정규표현식 검사 (한글, 영어로 2~10글자)
    const userNameRegex = /^[가-힣a-zA-Z]{2,10}$/;
    if (!userNameRegex.test(userName))
      return res.status(400).json({ error: 'Invalid userName.' });

    // loginId 정규표현식 (6~10글자, 영어 대소문자, 숫자 포함)
    const loginIdRegex = /^[a-zA-Z0-9]{6,10}$/;
    if (!loginIdRegex.test(loginId))
      return res.status(400).json({ error: 'Invalid loginId.' });

    // userPw 정규표현식 검사 (8~12글자, 영어, 숫자, 특수문자 포함)
    const userPwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
    if (!userPwRegex.test(userPw))
      return res.status(400).json({ error: 'Invalid userPw.' });

    // userNick 정규표현식 검사 (한글, 영어로 2~10글자)
    const userNickRegex = /^[가-힣a-zA-Z]{2,10}$/;
    if (!userNickRegex.test(userNick))
      return res.status(400).json({ error: 'Invalid userNick.' });

    // 비밀번호 해싱
    const hashedPw = hashPw(userPw);

    const newUser = await User.create({
      userName,
      loginId,
      userPw: hashedPw,
      email,
      address,
      userNick,
      birthday,
    });

    res.json(newUser);
    // 회원가입 완료 시 회원가입 완료 페이지로 이동
    // if (newUser) res.render('user/registerCompletePage')
    //   else res.status(500).send('Internal Server Error');

    //   {
    //     "userId": 6,
    //     "userName": "가힣당",
    //     "loginId": "ijoijmm1",
    //     "userPw": "$2b$10$EGg.XW4SHXhM5qvMsGsZ4eFd7QNXQZWi1yRrrfCmqbTaWoHEIZlFO",
    //     "email": "urlend@gamil.com",
    //     "address": "seoul",
    //     "userNick": "lion",
    //     "birthday": "1996-06-21",
    //     "updatedAt": "2024-07-13T12:27:30.884Z",
    //     "createdAt": "2024-07-13T12:27:30.884Z"
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 로그인 페이지
exports.loginPage = (req, res) => {
    res.render('user/loginPage');
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

// 로그인 로직 session 포함
exports.userLogin = async (req, res) => {
  try {
    const { loginId, userPw } = req.body;

    // 회원 조회
    const user = await User.findOne({
      where: { loginId },
    });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    // 데이터베이스에 저장된 해시된 비밀번호와 입력된 비밀번호를 비교
    const isPasswordValid = comparePw(userPw, user.userPw);

    if (!isPasswordValid)
      return res.status(401).json({ error: 'Invalid password.' });

    req.session.user = {
      userId: user.userId,
      profileImg: user.profileImg, // 프로필 이미지 없으면 null
      userNick: user.userNick,
      isLoggedIn: true,
    };
    console.log(req.session.user);

    res.json(user);
    // 로그인 완료하면 메인(전체 게시물 목록)페이지로 이동
    // if (req.session.user) res.redirect('/');
    // else res.send({ result: false });

    //   {
    //     "userId": 6,
    //     "userName": "가힣당",
    //     "loginId": "ijoijmm1",
    //     "userPw": "$2b$10$EGg.XW4SHXhM5qvMsGsZ4eFd7QNXQZWi1yRrrfCmqbTaWoHEIZlFO",
    //     "email": "urlend@gamil.com",
    //     "address": "seoul",
    //     "profileImg": null,
    //     "userNick": "lion",
    //     "birthday": "1996-06-21",
    //     "createdAt": "2024-07-13T12:27:30.000Z",
    //     "updatedAt": "2024-07-13T12:27:30.000Z"
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 로그인 아이디 중복 체크
exports.checkDuplicatedLoginid = async (req, res) => {
  try {
    const { loginId } = req.body;

    const user = await User.findOne({
      where: { loginId },
    });

    // loginId가 이미 존재하는 경우
    if (user) return res.status(409).json({ result: true });
    // loginId가 존재하지 않는 경우
    else res.json({ result: false });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

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
    const { userId } = req.params;
    // const { userId } = req.session.user;
    const { email, address, profileImg, userNick } = req.body;

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

    // 수정된 정보를 session에도 저장
    req.session.user = {
      ...req.session.user,
      profileImg: updatedUser.profileImg,
      userNick: updatedUser.userNick,
    };
    // console.log('updateUserSession', req.session.user);
    res.json(updatedUser);
    // 회원 정보 수정을 완료하면 업데이트된 정보를 가지고 마이페이지에 다시 출력
    // if (updatedUser) res.send({ updatedUser, sessionUser: req.session.user });
    // else res.status(500).send('Internal Server Error');

    //   {
    //     "userId": 6,
    //     "userName": "가힣당",
    //     "loginId": "ijoijmm1",
    //     "userPw": "$2b$10$EGg.XW4SHXhM5qvMsGsZ4eFd7QNXQZWi1yRrrfCmqbTaWoHEIZlFO",
    //     "email": "ranikun@gamil.com",
    //     "address": "raniland wio",
    //     "profileImg": "babocat.jpg",
    //     "userNick": "babo",
    //     "birthday": "1996-06-21",
    //     "createdAt": "2024-07-13T12:27:30.000Z",
    //     "updatedAt": "2024-07-13T13:12:35.000Z"
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 회원 조회
// exports.getUser = async (req, res) => {
//   // userId는 session에서 가져오기로 변경
//   const { userId } = req.params;

//   const user = await User.findOne({
//     where: { userId },
//   });

//   if (!user) return res.status(404).json({ error: 'User not found' });

//   res.json(user);
// };

// 로그아웃 로직
exports.userLogout = async (req, res) => {
  console.log('session', req.session);
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Failed to logout.');
    // 로그아웃 완료하면 메인(전체 게시물 목록)페이지로 이동
    // res.redirect('/')
    res.send('Logged out successfully.');
  });
};

// 마이페이지 이동
// exports.getProfilePage = async (req, res) => {
//   // 페이지 이동시 로그인 상태인지 확인
//   if (req.session.user) {
//     const { userId } = req.session.user;

//     const user = await User.findOne({
//       where: { userId },
//     });
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     // 회원 조회 한 후 조회한 데이터 가지고 마이페이지로 이동
//     res.render('user/profilePage', { user, sessionUser:req.session.user });
//   } else res.redirect('/user/login');
// };
