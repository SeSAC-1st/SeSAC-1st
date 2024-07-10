// Post 관련 컨트롤러

const { Post } = require('../../models/index');
const { Op } = require('sequelize');

// 전체 게시물 목록 조회 및 검색 메서드
exports.getPostList = async (req, res) => {
  try {
    const { page, size } = req.params;
    const { search } = req.query;

    const pageNumber = page ? parseInt(page, 10) : 1;
    const pageSize = size ? parseInt(size, 10) : 12
    const offset = (pageNumber - 1) * pageSize;
    let pastList;

    if (search) {
      postList = await Post.findAll({
        where: {
          isDeleted: false, // isDeleted가 false일 경우만
          postTitle: {
            [Op.like]: `%${search}%`
          }
        }, 
        offset: offset, // 보여 줄 페이지
        limit: pageSize // 한 페이지에 출력할 데이터의 개수
      });
    } else {
      postList = await Post.findAll({
        where: { isDeleted: false },
        offset: offset,
        limit: pageSize 
      });
    }
    res.json(postList);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// 사용자 게시물 목록 조회 메서드
exports.getUserPostList = async (req, res) => {
  try {
    const { userId, page, size } = res.params;

    res.json();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// 월별 게시물 개수 조회 메서드
exports.getMonthlyPostCounts = async (req, res) => {
  try {
    const { userId } = req.body;
    res.json();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// 게시물 조회 매서드
exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      where: { postId }
    });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// 게시물 수정 매서드
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { postTitle, postContent } = req.body;

    const postUpdate = await Post.update(
      { postTitle, postContent },
      { where: { postId } }
    );

    res.json(postUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// 게시물 삭제 메서드
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const postDelete = await Post.update(
      { isDeleted: true },
      { where: { postId } }
    );

    res.json(postDelete);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// 게시글 등록 메서드
exports.insertPost = async (req, res) => {
  try {
    // userId는 차후 session에서 가져오는 것으로 수정
    const { postTitle, postContent, userId } = req.body;

    const postcreate = await Post.create({
      postTitle, postContent, userId
    });

    res.json(postcreate);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}