const { Post, Comment, User } = require('../../models/index');
// fn: SQL 함수 호출을 나타내기 위해 사용(함수 이름과 인수를 받아 호출 생성)
// col: 특정 칼럼을 참조하기 위해 사용
// literal: 원시 SQL 구문을 삽입하기 위해 사용
const { Op, fn, col, literal } = require('sequelize');

// 전체 게시물 목록 조회 및 검색 메서드, 전체 개수, 댓글 수도 출력
exports.getPostList = async (req, res) => {
  try {
    const { page, size } = req.params;
    const { postTitle } = req.query;

    const pageNumber = page ? parseInt(page, 10) : 1;
    const pageSize = size ? parseInt(size, 10) : 12;
    const offset = (pageNumber - 1) * pageSize;

    let postList;
    let postCount;

    if (postTitle) {
      // 제목 검색
      postCount = await Post.count({
        where: {
          isDeleted: false,
          postTitle: {
            [Op.like]: `%${postTitle}%`,
          },
        },
      });

      postList = await Post.findAll({
        where: {
          isDeleted: false,
          postTitle: {
            // 문자열 검색에세 부분 일치 찾기
            [Op.like]: `%${postTitle}%`,
          },
        },
        offset: offset, // 보여 줄 페이지
        limit: pageSize, // 한 페이지에 출력할 데이터의 개수
        attributes: [
          'postId',
          'postTitle',
          'postContent',
          'userId',
          'createdAt',
          [
            fn('COALESCE', fn('COUNT', col('Comments.comId')), 0),
            'commentCount',
          ],
        ],
        include: [
          {
            model: Comment,
            as: 'Comments',
            where: {
              isDeleted: false,
            },
            required: false,
            attributes: [], // join에 필요한 컬럼이 없으므로 빈 배열로 설정
          },
          {
            model: User,
            as: 'User',
            attributes: ['userNick'], // User 테이블에서 userNick 컬럼만 선택
          },
        ],
        group: ['Post.postId', 'User.userNick'], // 그룹화 필드에 User.userNick 추가
        subQuery: false, // 서브쿼리를 사용하지 않도록 설정
      });
    } else {
      // 검색 안한 버전
      postCount = await Post.count({
        where: {
          isDeleted: false,
        },
      });

      postList = await Post.findAll({
        where: {
          isDeleted: false,
        },
        limit: pageSize,
        offset: offset,
        attributes: [
          'postId',
          'postTitle',
          'postContent',
          'userId',
          'createdAt',
          [
            fn('COALESCE', fn('COUNT', col('Comments.comId')), 0),
            'commentCount',
          ],
        ],
        include: [
          {
            model: Comment,
            as: 'Comments',
            where: {
              isDeleted: false,
            },
            required: false,
            attributes: [], // join에 필요한 컬럼이 없으므로 빈 배열로 설정
          },
          {
            model: User,
            as: 'User',
            attributes: ['userNick'], // User 테이블에서 userNick 컬럼만 선택
          },
        ],
        group: ['Post.postId', 'User.userNick'], // 그룹화 필드에 User.userNick 추가
        subQuery: false, // 서브쿼리를 사용하지 않도록 설정
      });
    }
    const pageCount = Math.ceil(postCount / pageSize);
    res.json({ postList, postCount, pageCount, currentPage: pageNumber });
    // 검색 후 메인페이지(전체 게시물 목록 페이지로 이동), 안에 리스트랑 count를 따로 보내줘도 됨
    // res.render('posts/postsPage', {
    //   postList,
    //   postCount,
    //   pageCount,
    //   currentPage: pageNumber,
    //   sessionUser: req.session.user ? req.session.user : null
    // });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 사용자 게시물 목록 조회 메서드, 전체 개수도 출력, 차트도 같은 화면에 출력
exports.getUserPostList = async (req, res) => {
  try {
    // 페이지 이동시 로그인 상태인지 확인
    if (req.session.user) {
      // const { userId } = req.session.user;
      const { userId, page, size } = req.params;

      const pageNumber = page ? parseInt(page, 10) : 1;
      const pageSize = size ? parseInt(size, 10) : 12;
      const offset = (pageNumber - 1) * pageSize;

      const userPostCount = await Post.count({
        where: {
          isDeleted: false,
          userId,
        },
      });
      const userPostList = await Post.findAll({
        where: {
          isDeleted: false,
          userId,
        },
        limit: pageSize,
        offset: offset,
        attributes: [
          'postId',
          'postTitle',
          'postContent',
          'userId',
          'createdAt',
          [
            fn('COALESCE', fn('COUNT', col('Comments.comId')), 0),
            'commentCount',
          ],
        ],
        include: [
          {
            model: Comment,
            as: 'Comments',
            where: {
              isDeleted: false,
            },
            required: false,
            attributes: [], // join에 필요한 컬럼이 없으므로 빈 배열로 설정
          },
          {
            model: User,
            as: 'User',
            attributes: ['userNick'], // User 테이블에서 userNick 컬럼만 선택
          },
        ],
        group: ['Post.postId', 'User.userNick'], // 그룹화 필드에 User.userNick 추가
        subQuery: false, // 서브쿼리를 사용하지 않도록 설정
      });

      const cntPostGroupMonth = await this.getMonthlyPostCounts(userId);
      const pageCount = Math.ceil(userPostCount / pageSize);

      res.json({
        userPostList,
        userPostCount,
        pageCount,
        cntPostGroupMonth,
        currentPage: pageNumber,
      });
      // 내글 목록 버튼 눌렀을때 실행되어야함, 차트까지 같이 렌더
      // res.render('posts/myPostsPage', {
      //   userPostList,
      //   userPostCount,
      //   cntPostGroupMonth,
      //   currentPage: pageNumber,
      //   sessionUser: req.session.user,
      // });
    } else res.redirect('/user/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 월별 게시물 개수 조회 메서드
exports.getMonthlyPostCounts = async (userId) => {
  try {
    // 현재 연도 가져오기
    const currentYear = new Date().getFullYear();

    // 데이터베이스에서 현재 연도의 연도별, 월별 게시물 개수를 가져옴
    const monthlyPostCounts = await Post.findAll({
      where: {
        userId,
        isDeleted: false,
        // 모든 조건이 참일 때만 반환
        [Op.and]: [
          // createdAt 중 현재 연도와 같은 값을 찾아내는 SQL 구문
          literal(`YEAR(createdAt) = ${currentYear}`),
        ],
      },
      attributes: [
        // createdAt 칼럼에서 연도를 추출하여 별칭(ex. year)으로 표시
        [fn('YEAR', col('createdAt')), 'year'],
        [fn('MONTH', col('createdAt')), 'month'],
        [fn('COUNT', col('*')), 'count'],
      ],
      group: [fn('YEAR', col('createdAt')), fn('MONTH', col('createdAt'))], // 그룹화
      order: [
        // 월별로 오름차순 정렬
        [fn('MONTH', col('createdAt')), 'ASC'],
      ],
    });

    // 데이터베이스 결과를 JSON 형식으로 변환
    // - Sequelize에서 가져온 모델 인스턴스는 특정 메서드와 속성을 가지고 있음
    // - 그대로 JSON.stringify()로 변환할 경우 메타 데이터와 함께 출력
    // - 순수한 데이터 값만 필요하기 때문에 get({ plain: true })를 사용하여 순수 데이터 값 추출
    const monthlyPostCountsJson = monthlyPostCounts.map((result) =>
      result.get({ plain: true })
    );

    // 1 ~ 12월까지의 모든 월에 대해 기본 값을 설정
    const allMonths = [];
    for (let month = 1; month <= 12; month++) {
      allMonths.push({
        year: currentYear,
        month: month,
        count: 0,
      });
    }

    // 데이터베이스 결과를 기본 값에 병합
    for (const record of monthlyPostCountsJson) {
      // 데이터베이스에서 가져온 결과(record)와 기본 값 배열(allMonths)를 비교하여 동일한 월 찾기
      const index = allMonths.findIndex(
        (m) => m.year === record.year && m.month === record.month
      );
      if (index !== -1) {
        // 해당 월애 값이 존재한다면 데이터베이스의 값으로 업데이트
        allMonths[index].count = record.count;
      }
    }

    return allMonths;
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 단일 게시물 조회 매서드
exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ['userNick'], // User 테이블에서 userNick 컬럼만 선택
        },
      ],
    });

    // 해당 postId에 해당하는 댓글과 대댓글 목록
    const commList = await Comment.findAll({
      where: {
        // 댓글은 postId에 해당하고 상위 댓글이 없고 삭제되지 않은것 조회
        postId, // 댓글 postId로 조회
        parentComId: null, // 상위 댓글 가져오기
        isDeleted: false, // 상위 댓글이 삭제되지 않은 것만 조회
      },
      include: [
        {
          model: User,
          attributes: ['userNick'], // User 테이블에서 userNick 컬럼만 선택
        },
        {
          model: Comment,
          as: 'replies', // 대댓글 관계 설정
          where: {
            postId, // 대댓글도 postId로 조회
            isDeleted: false, // 삭제되지 않은 대댓글만 가져옴
          },
          required: false,
          include: [
            {
              model: User,
              attributes: ['userNick'], // User 테이블에서 userNick 컬럼만 선택
            },
          ],
        },
      ],
      order: [
        // 정렬은 다시 한번 확인 필요
        ['createdAt', 'ASC'], // 댓글 순서대로 정렬
        ['replies', 'createdAt', 'ASC'], // 대댓글 순서대로 정렬
      ],
    });

    res.json({ post, commList });
    // 각 게시물 제목 클릭하면 조회해서 게시물 상세 페이지로 데이터 가지고 이동, 댓글/대댓글 리스트 포함
    // res.render('posts/postDetailPage', {
    //   post,
    //   commList,
    //   sessionUser: req.session.user ? req.session.user : null,
    // });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 게시물 수정 매서드
exports.updatePost = async (req, res) => {
  try {
    if (req.session.user) {
      const { postId } = req.params;
      const { postTitle, postContent } = req.body;

      const postUpdate = await Post.update(
        { postTitle, postContent },
        { where: { postId } }
      );

      res.json(postUpdate[0]);
      // 수정 버튼 눌렀을때 수정완료 되면 상세 페이지로 redirect
      // if (postUpdate[0] === 1) res.send({result:true})
      // else res.send({result:false})    // 수정 실패
      // 리턴을 업데이트된 행의 개수 - 1
    } else res.redirect('/user/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 게시물 삭제 메서드
exports.deletePost = async (req, res) => {
  try {
    if (req.session.user) {
      const { postId } = req.params;

      const postDelete = await Post.update(
        { isDeleted: true },
        { where: { postId } }
      );

      const commentDelete = await Comment.update(
        { isDeleted: true },
        { where: { postId } }
      );

      res.json({ postDelete, commentDelete });
      // if (postDelete[0] === 1) res.send({result:true})
      //   else res.send({result:false})    // 삭제 실패
      // 삭제 완료 되면 사용자 게시물 목록 페이지로 이동
    } else res.redirect('/user/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 게시글 등록 메서드
exports.insertPost = async (req, res) => {
  try {
    if (req.session.user) {
      // const {userId} = req.session.user
      const { postTitle, postContent, userId } = req.body;

      const postcreate = await Post.create({
        postTitle,
        postContent,
        userId,
      });

      res.json(postcreate);
      // 등록 완료 하면 사용자 게시물 목록으로 이동
      // if (postcreate) res.send({result:true})
      //   else res.status(400).send({ error: 'Failed to create post' });
    } else res.redirect('/user/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 검색 페이지 이동
exports.getSearchPage = (req, res) => {
  res.render('search/searchPage');
};

// 게시물 등록 폼 페이지 이동
exports.getCreatePostPage = (req, res) => {
  if (req.session.user) {
    res.render('posts/createPostPage');
  } else res.redirect('/user/login');
};

// 게시물 수정 폼 페이지 이동
exports.getEditPostPage = async (req, res) => {
  try {
    if (req.session.user) {
      const { postId } = req.params;
      const post = await Post.findOne({
        where: {
          postId,
        },
        attributes: ['postTitle', 'postContent'],
      });

      if (!post) {
        // 해당 postId의 게시물이 없는 경우 처리
        return res.status(404).send('게시물을 찾을 수 없습니다.');
      }

      res.json(post);
      // 게시물 정보를 렌더링하는 페이지로 이동
      res.render('posts/editPostPage', { post });
    } else res.redirect('/user/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
