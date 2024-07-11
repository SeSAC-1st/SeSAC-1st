const { Post, Comment } = require('../../models/index');
// fn: SQL 함수 호출을 나타내기 위해 사용(함수 이름과 인수를 받아 호출 생성)
// col: 특정 칼럼을 참조하기 위해 사용
// literal: 원시 SQL 구문을 삽입하기 위해 사용
const { Op, fn, col, literal } = require('sequelize');

// 전체 게시물 목록 조회 및 검색 메서드, 전체 개수도 출력
exports.getPostList = async (req, res) => {
  try {
    const { page, size } = req.params;
    const { boardTitle } = req.query;
    console.log('req.params', req.params);
    console.log('req.query', req.query);

    const pageNumber = page ? parseInt(page, 10) : 1;
    const pageSize = size ? parseInt(size, 10) : 12;
    const offset = (pageNumber - 1) * pageSize;

    let postList;

    if (boardTitle) {
      postList = await Post.findAndCountAll({
        where: {
          isDeleted: false, // isDeleted가 false일 경우만
          postTitle: {
            // 문자열 검색에세 부분 일치 찾기
            [Op.like]: `%${boardTitle}%`,
          },
        },
        offset: offset, // 보여 줄 페이지
        limit: pageSize, // 한 페이지에 출력할 데이터의 개수
      });
    } else {
      postList = await Post.findAndCountAll({
        where: { isDeleted: false },
        offset: offset,
        limit: pageSize,
      });
    }
    res.json(postList);
    //   {
    //     "count": 14,
    //     "rows": [
    //         {
    //             "postId": 2,
    //             "postTitle": "postTitle2",
    //             "postContent": "postContent2",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:12:26.000Z",
    //             "updatedAt": "2024-07-11T07:12:26.000Z"
    //         },
    //         {
    //             "postId": 3,
    //             "postTitle": "postTitle3",
    //             "postContent": "postContent3",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:13:52.000Z",
    //             "updatedAt": "2024-07-11T07:13:52.000Z"
    //         },
    //         {
    //             "postId": 4,
    //             "postTitle": "postTitle4",
    //             "postContent": "postContent4",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:13:58.000Z",
    //             "updatedAt": "2024-07-11T07:13:58.000Z"
    //         },
    //         {
    //             "postId": 5,
    //             "postTitle": "postTitle5",
    //             "postContent": "postContent5",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:04.000Z",
    //             "updatedAt": "2024-07-11T07:14:04.000Z"
    //         },
    //         {
    //             "postId": 6,
    //             "postTitle": "postTitle6",
    //             "postContent": "postContent6",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:11.000Z",
    //             "updatedAt": "2024-07-11T07:14:11.000Z"
    //         },
    //         {
    //             "postId": 7,
    //             "postTitle": "postTitle7",
    //             "postContent": "postContent7",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:18.000Z",
    //             "updatedAt": "2024-07-11T07:14:18.000Z"
    //         },
    //         {
    //             "postId": 8,
    //             "postTitle": "postTitle8",
    //             "postContent": "postContent8",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:25.000Z",
    //             "updatedAt": "2024-07-11T07:14:25.000Z"
    //         },
    //         {
    //             "postId": 9,
    //             "postTitle": "postTitle9",
    //             "postContent": "postContent9",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:30.000Z",
    //             "updatedAt": "2024-07-11T07:14:30.000Z"
    //         },
    //         {
    //             "postId": 10,
    //             "postTitle": "postTitle10",
    //             "postContent": "postContent10",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:37.000Z",
    //             "updatedAt": "2024-07-11T07:14:37.000Z"
    //         },
    //         {
    //             "postId": 11,
    //             "postTitle": "postTitle11",
    //             "postContent": "postContent11",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:44.000Z",
    //             "updatedAt": "2024-07-11T07:14:44.000Z"
    //         },
    //         {
    //             "postId": 12,
    //             "postTitle": "postTitle12",
    //             "postContent": "postContent12",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:51.000Z",
    //             "updatedAt": "2024-07-11T07:14:51.000Z"
    //         },
    //         {
    //             "postId": 13,
    //             "postTitle": "postTitle13",
    //             "postContent": "postContent13",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:57.000Z",
    //             "updatedAt": "2024-07-11T07:14:57.000Z"
    //         }
    //     ]
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 사용자 게시물 목록 조회 메서드, 전체 개수도 출력
exports.getUserPostList = async (req, res) => {
  try {
    const { userId, page, size } = req.params;

    const pageNumber = page ? parseInt(page, 10) : 1;
    const pageSize = size ? parseInt(size, 10) : 12;
    const offset = (pageNumber - 1) * pageSize;

    const userPostList = await Post.findAndCountAll({
      where: { userId },
      offset: offset,
      limit: pageSize,
    });

    res.json(userPostList);
    //   {
    //     "count": 15,
    //     "rows": [
    //         {
    //             "postId": 1,
    //             "postTitle": "postTitle1",
    //             "postContent": "postContent1",
    //             "userId": 1,
    //             "isDeleted": true,
    //             "createdAt": "2024-07-11T07:12:18.000Z",
    //             "updatedAt": "2024-07-11T07:16:34.000Z"
    //         },
    //         {
    //             "postId": 2,
    //             "postTitle": "postTitle2",
    //             "postContent": "postContent2",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:12:26.000Z",
    //             "updatedAt": "2024-07-11T07:12:26.000Z"
    //         },
    //         {
    //             "postId": 3,
    //             "postTitle": "postTitle3",
    //             "postContent": "postContent3",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:13:52.000Z",
    //             "updatedAt": "2024-07-11T07:13:52.000Z"
    //         },
    //         {
    //             "postId": 4,
    //             "postTitle": "postTitle4",
    //             "postContent": "postContent4",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:13:58.000Z",
    //             "updatedAt": "2024-07-11T07:13:58.000Z"
    //         },
    //         {
    //             "postId": 5,
    //             "postTitle": "postTitle5",
    //             "postContent": "postContent5",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:04.000Z",
    //             "updatedAt": "2024-07-11T07:14:04.000Z"
    //         },
    //         {
    //             "postId": 6,
    //             "postTitle": "postTitle6",
    //             "postContent": "postContent6",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:11.000Z",
    //             "updatedAt": "2024-07-11T07:14:11.000Z"
    //         },
    //         {
    //             "postId": 7,
    //             "postTitle": "postTitle7",
    //             "postContent": "postContent7",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:18.000Z",
    //             "updatedAt": "2024-07-11T07:14:18.000Z"
    //         },
    //         {
    //             "postId": 8,
    //             "postTitle": "postTitle8",
    //             "postContent": "postContent8",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:25.000Z",
    //             "updatedAt": "2024-07-11T07:14:25.000Z"
    //         },
    //         {
    //             "postId": 9,
    //             "postTitle": "postTitle9",
    //             "postContent": "postContent9",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:30.000Z",
    //             "updatedAt": "2024-07-11T07:14:30.000Z"
    //         },
    //         {
    //             "postId": 10,
    //             "postTitle": "postTitle10",
    //             "postContent": "postContent10",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:37.000Z",
    //             "updatedAt": "2024-07-11T07:14:37.000Z"
    //         },
    //         {
    //             "postId": 11,
    //             "postTitle": "postTitle11",
    //             "postContent": "postContent11",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:44.000Z",
    //             "updatedAt": "2024-07-11T07:14:44.000Z"
    //         },
    //         {
    //             "postId": 12,
    //             "postTitle": "postTitle12",
    //             "postContent": "postContent12",
    //             "userId": 1,
    //             "isDeleted": false,
    //             "createdAt": "2024-07-11T07:14:51.000Z",
    //             "updatedAt": "2024-07-11T07:14:51.000Z"
    //         }
    //     ]
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 월별 게시물 개수 조회 메서드
exports.getMonthlyPostCounts = async (req, res) => {
  try {
    const { userId } = req.body;

    // 현재 연도 가져오기
    const currentYear = new Date().getFullYear();

    // 데이터베이스에서 현재 연도의 연도별, 월별 게시물 개수를 가져옴
    const monthlyPostCounts = await Post.findAll({
      where: {
        userId: userId,
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

    // const currentMonth = new Date().getMonth() + 1; // 월은 0부터 시작하므로 +1
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

    res.json(allMonths);
    //   [
    //     {
    //         "year": 2024,
    //         "month": 1,
    //         "count": 0
    //     },
    //     {
    //         "year": 2024,
    //         "month": 2,
    //         "count": 0
    //     },
    //     {
    //         "year": 2024,
    //         "month": 3,
    //         "count": 0
    //     },
    //     {
    //         "year": 2024,
    //         "month": 4,
    //         "count": 0
    //     },
    //     {
    //         "year": 2024,
    //         "month": 5,
    //         "count": 0
    //     },
    //     {
    //         "year": 2024,
    //         "month": 6,
    //         "count": 0
    //     },
    //     {
    //         "year": 2024,
    //         "month": 7,
    //         "count": 14
    //     },
    //     {
    //         "year": 2024,
    //         "month": 8,
    //         "count": 0
    //     },
    //     {
    //         "year": 2024,
    //         "month": 9,
    //         "count": 0
    //     },
    //     {
    //         "year": 2024,
    //         "month": 10,
    //         "count": 0
    //     },
    //     {
    //         "year": 2024,
    //         "month": 11,
    //         "count": 0
    //     },
    //     {
    //         "year": 2024,
    //         "month": 12,
    //         "count": 0
    //     }
    // ]
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
    });
    res.json(post);
    // {
    //   "postId": 1,
    //   "postTitle": "search",
    //   "postContent": "up test",
    //   "userId": 1,
    //   "isDeleted": true,
    //   "createdAt": "2024-07-10T05:47:56.000Z",
    //   "updatedAt": "2024-07-10T06:49:04.000Z"
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

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
    // [
    //   1
    // ]
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 게시물 삭제 메서드
exports.deletePost = async (req, res) => {
  try {
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
    // {
    //   "postDelete": [
    //       1
    //   ],
    //   "commentDelete": [
    //       1
    //   ]
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 게시글 등록 메서드
exports.insertPost = async (req, res) => {
  try {
    // userId는 차후 session에서 가져오는 것으로 수정
    const { postTitle, postContent, userId } = req.body;

    const postcreate = await Post.create({
      postTitle,
      postContent,
      userId,
    });

    res.json(postcreate);
    // {
    //   "isDeleted": false,
    //   "postId": 29,
    //   "postTitle": "test 13",
    //   "postContent": "test 13",
    //   "userId": 5,
    //   "updatedAt": "2024-07-10T08:05:08.190Z",
    //   "createdAt": "2024-07-10T08:05:08.190Z"
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
