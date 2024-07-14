const { Comment } = require('../../models/index');

//댓글, 대댓글 목록 조회 - 게시글 상세 밑에 쓴 쿼리
// exports.getCommentList = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const commList = await Comment.findAll({
//       where: {
//         // 댓글은 postId에 해당하고 상위 댓글이 없고 삭제되지 않은것 조회
//         postId, // 댓글 postId로 조회
//         parentComId: null, // 상위 댓글 가져오기
//         isDeleted: false, // 상위 댓글이 삭제되지 않은 것만 조회
//       },
//       include: [
//         {
//           model: Comment,
//           as: 'replies', // 대댓글 관계 설정
//           where: {
//             postId, // 대댓글도 postId로 조회
//             isDeleted: false, // 삭제되지 않은 대댓글만 가져옴
//           },
//           required: false,
//         },
//       ],
//       order: [
//         ['createdAt', 'ASC'], // 댓글 순서대로 정렬
//         ['replies', 'createdAt', 'ASC'], // 대댓글 순서대로 정렬
//       ],
//     });
//     res.json(commList);
//     // [
//     //     {
//     //         "comId": 1,
//     //         "comContent": "댓글왕ㄹㅇㄴㄹ",
//     //         "postId": 1,
//     //         "userId": 1,
//     //         "parentComId": null,
//     //         "isDeleted": false,
//     //         "createdAt": "2024-07-10T02:44:42.000Z",
//     //         "updatedAt": "2024-07-10T05:10:09.000Z",
//     //         "replies": [
//     //             {
//     //                 "comId": 4,
//     //                 "comContent": "대댓글임",
//     //                 "postId": 1,
//     //                 "userId": 1,
//     //                 "parentComId": 1,
//     //                 "isDeleted": false,
//     //                 "createdAt": "2024-07-10T02:53:03.000Z",
//     //                 "updatedAt": "2024-07-10T02:53:03.000Z"
//     //             },
//     //             {
//     //                 "comId": 6,
//     //                 "comContent": "대댓글임111111",
//     //                 "postId": 1,
//     //                 "userId": 1,
//     //                 "parentComId": 1,
//     //                 "isDeleted": false,
//     //                 "createdAt": "2024-07-10T05:01:15.000Z",
//     //                 "updatedAt": "2024-07-10T05:01:15.000Z"
//     //             }
//     //         ]
//     //     },
//     //     {
//     //         "comId": 2,
//     //         "comContent": "댓글1",
//     //         "postId": 1,
//     //         "userId": 1,
//     //         "parentComId": null,
//     //         "isDeleted": false,
//     //         "createdAt": "2024-07-10T02:48:03.000Z",
//     //         "updatedAt": "2024-07-10T02:48:03.000Z",
//     //         "replies": []
//     //     },
//     //     {
//     //         "comId": 3,
//     //         "comContent": "대댓글1",
//     //         "postId": 1,
//     //         "userId": 1,
//     //         "parentComId": null,
//     //         "isDeleted": false,
//     //         "createdAt": "2024-07-10T02:49:49.000Z",
//     //         "updatedAt": "2024-07-10T02:49:49.000Z",
//     //         "replies": []
//     //     },
//     // ]
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

// 댓글 등록
exports.insertComment = async (req, res) => {
  try {
    // 댓글 등록 입력창 누르면 로그인 상태인지 아닌지 확인
    const { postId } = req.params;
    // const {userId} = req.session.user
    // userId는 세션에서 가져오기
    const { userId, comContent } = req.body;
    const insertCom = await Comment.create({
      comContent,
      postId,
      userId,
    });
    res.json({ insertCom });
    // 댓글 등록이 되면 해당 댓글을 댓글 목록 밑에 추가(화면 이동 안하고 바로 밑에 출력해줘야하기 때문에 좀더 생각)
    // if (insertCom) res.send({insertCom})
    //   else res.status(500).send({ error: '' });

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
    if (req.session.user) {
      const { comId } = req.params;
      const { comContent } = req.body;
      const updateComment = await Comment.update(
        { comContent }, // 업데이트할 컬럼
        {
          where: {
            // 조건
            comId,
          },
        }
      );
      res.json(updateComment[0]);
      // 수정 완료 하면 업데이트된 댓글을 그대로 보내줌, 아니면 content만 보내줘도 됨
      // if (updateComment[0] === 1) {
      //   const updatedComment = await Comment.findByPk(comId);
      //   res.send({updatedComment});
      // }

      // return : 1   업데이트된 행 개수
    } else res.redirect('/user/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    if (req.session.user) {
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
      res.json({ deleteComm, deleteReply });
      // 댓글 삭제가 완료되면 댓글 목록에서 해당 댓글이 없어져야함,대댓글도 같이 삭제, 프론트에서 다시 댓글 로드하는 방식??
      // if (deleteComm[0] === 1) res.send({result:true})
      //   else res.status(500).send({error:''})
    } else res.redirect('/user/login');

    // {
    //     "deleteComm": [
    //         1   업데이트된 행 개수
    //     ],
    //     "deleteReply": [
    //         2   업데이트된 행 개수
    //     ]
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 대댓글 삭제
exports.deleteCommentReply = async (req, res) => {
  try {
    if (req.session.user) {
      const { comId } = req.params;
      const deleteComm = await Comment.update(
        { isDeleted: true },
        {
          where: {
            // 해당 대댓글 업데이트
            comId,
          },
        }
      );
      res.json(deleteComm[0]); // 리턴값 : 1  업데이트된 행개수
      // 대댓글 삭제가 완료되면 댓글 목록에서 해당 대댓글이 없어져야함, 프론트에서 다시 댓글 로드하는 방식??
      // if (deleteComm[0] === 1) res.send({result:true})
      //   else res.status(500).send({error:''})
    } else res.redirect('/user/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// 대댓글 등록
exports.insertReply = async (req, res) => {
  try {
    if (req.session.user) {
      // userId는 세션에서 가져오고, parentComId 는 답글달기 버튼 눌렀을 때 해당 댓글의 comId 넣기
      // const {userId} = req.session.user
      const { comId } = req.params;
      const { postId, userId, comContent } = req.body;
      const insertReply = await Comment.create({
        comContent,
        postId,
        userId,
        parentComId: comId,
      });
      res.json(insertReply);
      // 대댓글 등록 완료되면 등록된 대댓글을 댓글 목록에 추가
      // if (insertReply) res.send({insertReply})
      // else res.status(500).send({ error: '' });
    } else res.redirect('/user/login');

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
