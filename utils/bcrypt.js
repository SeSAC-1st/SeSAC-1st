const bcrypt = require('bcrypt');
const saltRounds = 10;

// 비밀번호 해싱 함수 정의
const hashPw = (pw) => {
return bcrypt.hashSync(pw, saltRounds);
}

// 비밀번호 정답 검증 함수 정의
const comparePw = (inputPw, originalPw) => {
    return bcrypt.compareSync(inputPw, originalPw);
}

exports.bcrypt =  { hashPw, comparePw };
