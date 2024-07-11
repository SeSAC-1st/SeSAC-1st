const bcrypt = require('bcrypt');
const saltRounds = 6;

// 비밀번호 해싱 함수 정의
exports.hashPw = (pw) => {
    console.log(pw);
return bcrypt.hashSync(pw, saltRounds);
}

// 비밀번호 정답 검증 함수 정의
exports.comparePw = (inputPw, originalPw) => {
    console.log(comparpw);
    return bcrypt.compareSync(inputPw, originalPw);
}
