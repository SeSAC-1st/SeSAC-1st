const { Comment } = require('../../models/index');

//댓글, 대댓글 목록 조회
exports.getCommentList = async (req, res) => {
  try {
    // 쿼리 어떻게 나오는지 보고 화면에 어떻게 뿌릴지 확인
    const { postId } = req.params;
    const commList = await Comment.findAll({
      where: {
        // 댓글은 postId에 해당하고 상위 댓글이 없고 삭제되지 않은것 조회
        postId, // 댓글 postId로 조회
        parentComId: null, // 상위 댓글 가져오기
        isDeleted: false, // 상위 댓글이 삭제되지 않은 것만 조회
      },
      include: [
        {
          model: Comment,
          as: 'replies', // 대댓글 관계 설정
          where: {
            postId, // 대댓글도 postId로 조회
            isDeleted: false, // 삭제되지 않은 대댓글만 가져옴
          },
          required: false,
        },
      ],
      order: [
        ['createdAt', 'ASC'], // 댓글 순서대로 정렬
        ['replies', 'createdAt', 'ASC'], // 대댓글 순서대로 정렬
      ],
    });
    res.json(commList);
    // [
    //     {
    //         "comId": 1,
    //         "comContent": "댓글왕ㄹㅇㄴㄹ",
    //         "postId": 1,
    //         "userId": 1,
    //         "parentComId": null,
    //         "isDeleted": false,
    //         "createdAt": "2024-07-10T02:44:42.000Z",
    //         "updatedAt": "2024-07-10T05:10:09.000Z",
    //         "replies": [
    //             {
    //                 "comId": 4,
    //                 "comContent": "대댓글임",
    //                 "postId": 1,
    //                 "userId": 1,
    //                 "parentComId": 1,
    //                 "isDeleted": false,
    //                 "createdAt": "2024-07-10T02:53:03.000Z",
    //                 "updatedAt": "2024-07-10T02:53:03.000Z"
    //             },
    //             {
    //                 "comId": 6,
    //                 "comContent": "대댓글임111111",
    //                 "postId": 1,
    //                 "userId": 1,
    //                 "parentComId": 1,
    //                 "isDeleted": false,
    //                 "createdAt": "2024-07-10T05:01:15.000Z",
    //                 "updatedAt": "2024-07-10T05:01:15.000Z"
    //             }
    //         ]
    //     },
    //     {
    //         "comId": 2,
    //         "comContent": "댓글1",
    //         "postId": 1,
    //         "userId": 1,
    //         "parentComId": null,
    //         "isDeleted": false,
    //         "createdAt": "2024-07-10T02:48:03.000Z",
    //         "updatedAt": "2024-07-10T02:48:03.000Z",
    //         "replies": []
    //     },
    //     {
    //         "comId": 3,
    //         "comContent": "대댓글1",
    //         "postId": 1,
    //         "userId": 1,
    //         "parentComId": null,
    //         "isDeleted": false,
    //         "createdAt": "2024-07-10T02:49:49.000Z",
    //         "updatedAt": "2024-07-10T02:49:49.000Z",
    //         "replies": []
    //     },
    //     {
    //         "comId": 5,
    //         "comContent": "댓글이용",
    //         "postId": 1,
    //         "userId": 1,
    //         "parentComId": null,
    //         "isDeleted": false,
    //         "createdAt": "2024-07-10T04:56:47.000Z",
    //         "updatedAt": "2024-07-10T04:56:47.000Z",
    //         "replies": []
    //     }
    // ]
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 댓글 등록
exports.insertComment = async (req, res) => {
  try {
    const { postId } = req.params;
    // userId는 세션에서 가져오기
    const { userId, comContent } = req.body;
    const insertCom = await Comment.create({
      comContent,
      postId,
      userId,
    });
    res.json(insertCom); // 입력된 댓글 객체로
    // {
    //     "isDeleted": false,
    //     "comId": 7,
    //     "comContent": "댓글이용ㅎ왈",
    //     "postId": "1",
    //     "userId": 1,
    //     "updatedAt": "2024-07-10T05:12:06.435Z",
    //     "createdAt": "2024-07-10T05:12:06.435Z"
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 댓글, 대댓글 수정
exports.updateComment = async (req, res) => {
  try {
    const { comId } = req.params;
    const { comContent } = req.body;
    const updateComm = await Comment.update(
      { comContent }, // 업데이트할 컬럼
      {
        where: {
          // 조건
          comId,
        },
      }
    );
    res.json(updateComm);
    // return : 1   업데이트된 행 개수
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    const { comId } = req.params;
    const deleteComm = await Comment.update(
      { isDeleted: true }, // 논리적 삭제
      {
        where: {
          // 상위 댓글 업데이트
          comId,
        },
      }
    );
    const deleteReply = await Comment.update(
      { isDeleted: true }, // 논리적 삭제
      {
        where: {
          // 해당 댓글의 대댓글까지 업데이트
          parentComId: comId,
        },
      }
    );
    // {
    //     "deleteComm": [
    //         1   업데이트된 행 개수
    //     ],
    //     "deleteReply": [
    //         2   업데이트된 행 개수
    //     ]
    // }
    res.json({ deleteComm, deleteReply });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 대댓글 삭제
exports.deleteCommentReply = async (req, res) => {
  try {
    const { comId } = req.params;
    const deleteComm = await Comment.update(
      { isDeleted: true }, // 논리적 삭제
      {
        where: {
          // 해당 대댓글 업데이트
          comId,
        },
      }
    );
    res.json(deleteComm); // 리턴값 : 1  업데이트된 행개수
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
// -- Post 테이블의 isDeleted 컬럼을 true로 업데이트
// UPDATE Post
// SET isDeleted = 1
// WHERE PostId = @PostId;

// -- Comment 테이블의 isDeleted 컬럼을 true로 업데이트
// UPDATE Comment
// SET isDeleted = 1
// WHERE PostId = @PostId;

// 대댓글 등록
exports.insertReply = async (req, res) => {
  try {
    // userId는 세션에서 가져오고, parentComId 는 답글달기 버튼 눌렀을 때 해당 댓글의 comId 넣기
    const { comId } = req.params;
    const { postId, userId, comContent } = req.body;
    const insertReply = await Comment.create({
      comContent,
      postId,
      userId,
      parentComId: comId,
    });
    res.json(insertReply);
    // {
    //     "isDeleted": false,
    //     "comId": 8,
    //     "comContent": "ㅐㅑㅓㅑㅐㅓㅑ",
    //     "postId": 1,
    //     "userId": 1,
    //     "parentComId": "1",
    //     "updatedAt": "2024-07-10T07:11:59.217Z",
    //     "createdAt": "2024-07-10T07:11:59.217Z"
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
