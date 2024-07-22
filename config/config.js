// DB 연결 정보를 환경변수를 사용해 선언
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({
  // 기본 .env 파일 로드
  path: path.resolve(__dirname, '../.env'),
});

const config = {
  username: process.env.USER_NAME,
  password: process.env.DATABASE_PW,
  database: process.env.DATABASE_NAME,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
};

module.exports = config;
