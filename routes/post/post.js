const express = require('express');
const router = express.Router();
const controller = require('../../controller/post/Cpost');

// 전체 게시물 목록 조회
// 검색 테스트 시 http://localhost:8080/post/list/1/12?search=boardTitle 형식으로
router.get('/list/:page/:size', controller.getPostList);

// 전체 게시물 목록 조회(제목으로 검색)
// axios에서 url 은 `/list/${page}/${size}?search=${searchKeyword}` 이런 형식으로 작성
router.get('/list/:page/:size?boardTitle=:keyword', controller.getPostList);

// 사용자 게시물 목록 조회 라우터
router.get('/list/:userId/:page/:size', controller.getUserPostList);

// 월별 게시물 개수 조회  라우터
router.get('/countByMonth', controller.getMonthlyPostCounts);

// 게시물 조회 라우터
router.get('/:postId', controller.getPost);

// 게시물 수정 라우터
router.patch('/:postId', controller.updatePost);

// 게시물 삭제 라우터
router.patch('/:postId/delete', controller.deletePost);

// 게시물 등록 라우터
router.post('/', controller.insertPost);

module.exports = router;
