const { Comment } = require('../../models/index')

//댓글, 대댓글 목록 조회
exports.getCommentList = async (req, res) => {
    try {
        const { postId } = req.params
        const commList = await Comment.findAll({
            where: {
                postId,   // 해당 게시물의 댓글, 대댓글 목록
                parentComId: null // 상위 댓글이 없는 댓글만 가져옴
            },
            include: [
                {
                    model: Comment,
                    as: 'replies', // 대댓글 관계 설정
                    where: {
                        isDeleted: false // 삭제되지 않은 대댓글만 가져옴
                    }
                }
            ],
            order: [
                ['createdAt', 'ASC'], // 댓글 순서대로 정렬
                ['replies', 'createdAt', 'ASC'] // 대댓글 순서대로 정렬
            ]
        })
        res.json(commList)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}

// 댓글 등록
exports.insertComment = async (req, res) => {
    try {
        const { postId } = req.params
        // userId는 세션에서 가져오기
        const { userId, comContent } = req.body
        const insertCom = await Comment.create({
            comContent, postId, userId
        })
        res.json(insertCom)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}

// 댓글, 대댓글 수정
exports.updateComment = async (req, res) => {
    try {
        const { comId } = req.params
        const { comContent } = req.body
        const updateComm = await Comment.update(
            { comContent },    // 업데이트할 컬럼
            {
                where: {  // 조건
                    comId
                }
            }
        )
        res.json(updateComm)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}

// 댓글, 대댓글 삭제
exports.deleteComment = async (req, res) => {
    try {
        const { comId } = req.params
        const deleteComm = await Comment.update(
            { isDeleted: true },    // 논리적 삭제
            {
                where: {   // 조건
                    comId
                }
            }
        )
        res.json(deleteComm)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}
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
        const {comId} = req.params
        const { postId, userId, comContent } = req.body
        const insertReply = await Comment.create({
            comContent, postId, userId, parentComId : comId
        })
        res.json(insertReply)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}