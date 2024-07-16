const express = require('express');
const router = express.Router();
const controller = require('../controller/post/Cpost');

// 메인 페이지 이동(전체 게시물 목록)
router.get('/', controller.getPostList);

module.exports = router;
