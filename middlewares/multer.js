const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname); // 파일의 원래 확장자 추출
    const filename = `${uuidv4()}${extname}`; // UUID와 확장자를 조합하여 파일명 생성
    cb(null, filename); // 최종 파일명 설정
  }
});

// 파일 필터링 함수 정의
const fileFilter = (req, file, cb) => {
  // 허용할 확장자 정의
  const allowedFileTypes = ['.png', '.jpeg', '.jpg'];
  // 파일 확장자 확인
  const extname = path.extname(file.originalname).toLowerCase();
  // 허용할 확장자인지 체크
  if (allowedFileTypes.includes(extname)) {
    // 허용할 경우
    cb(null, true);
  } else {
    // 허용하지 않을 경우
    cb(new Error('Only .png, .jpeg, .jpg files are allowed!'), false);
  }
};

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter // 파일 필터 적용
});

module.exports = uploadMiddleware;
