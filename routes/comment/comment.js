const express = require('express');
const controller = require('../../controller/comment/Ccomment');
const router = express.Router();

//댓글, 대댓글 목록 조회
router.get('/list/:postId', controller.getCommentList)

// 댓글 등록
router.post('/:postId', controller.insertComment)

// 댓글, 대댓글 수정
router.patch('/:comId', controller.updateComment)

// 댓글, 대댓글 삭제
router.patch('/:comId', controller.deleteComment)

// 대댓글 등록
router.post('/:comId', controller.insertReply)

module.exports = router