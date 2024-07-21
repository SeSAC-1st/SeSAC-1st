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

    if (newUser) res.send({ result: true });
    else res.send({ result: false });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 로그인 페이지
exports.loginPage = (req, res) => {
  res.render('user/loginPage');
};

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
    };

    req.session.save(function (error) {
      if (error) {
        console.error('session error --', error);
        return res.status(500).json({ error: 'Session 저장 실패' });
      }
      res.send({ result: true });
    });
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
    const { userId } = req.session.user;
    const { email, address, userNick, birthday } = req.body;
    const defaultProfileImg = 'user.png';
    const user = await User.findOne({
      where: { userId },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    let profileImg = user.profileImg || defaultProfileImg;
    // 파일이 업로드 되었을 경우
    if (req.file) {
      const allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
      if (allowedExtensions.includes(req.file.mimetype)) {
        profileImg = req.file.filename;
      } else {
        profileImg = user.profileImg || defaultProfileImg; // 잘못된 확장자의 경우, 기존 이미지 유지
      }
    } else if (req.body.profileImg === 'user.png') {
      // 이미지 초기화 시 기본 이미지 설정
      profileImg = defaultProfileImg;
    } else if (req.body.profileImg === '') {
      // 빈 문자열이 전달된 경우 기존 이미지 유지
      profileImg = user.profileImg || defaultProfileImg;
    }
    const updatedData = {
      email: email || user.email,
      address: address || user.address,
      profileImg: profileImg,
      userNick: userNick || user.userNick,
      birthday: birthday || user.birthday,
    };
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
    if (updatedUser) res.send({ updatedUser, sessionUser: req.session.user });
    else res.status(500).send('Internal Server Error');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 로그아웃 로직
exports.userLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Failed to logout.');
    // 로그아웃 완료하면 메인(전체 게시물 목록)페이지로 이동
    res.redirect('/');
  });
};

// 마이페이지 이동
exports.getProfilePage = async (req, res) => {
  // 페이지 이동시 로그인 상태인지 확인
  if (req.session.user) {
    const { userId } = req.session.user;

    const user = await User.findOne({
      where: { userId },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // 회원 조회 한 후 조회한 데이터 가지고 마이페이지로 이동
    res.render('user/profilePage', { user, sessionUser: req.session.user });
  } else
    res.status(302).send(`
    <script>
      alert('로그인이 필요합니다.');
      window.location.href = '/user/login';
    </script>
  `);
};

// 회원가입 완료 페이지 이동
exports.getRegisterCompletePage = (req, res) => {
  res.render('user/registerCompletePage');
};
