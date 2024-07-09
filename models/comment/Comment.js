const commentModel = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        comId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        //   comment: '댓글 아이디'
        },
        comContent: {
          type: DataTypes.STRING(200),
          allowNull: false,
        //   comment: '댓글 내용'
        },
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        //   comment: '게시판 아이디',
        //   references: {
        //     model: 'Post',
        //     key: 'id'
        //   }
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        //   comment: '회원 아이디',
        //   references: {
        //     model: 'User',
        //     key: 'id'
        //   }
        },
        // createdAt: {
        //   type: DataTypes.DATE,
        //   allowNull: false,
        //   defaultValue: Sequelize.NOW,
        //   comment: '생성일자'
        // },
        // updatedAt: {
        //   type: DataTypes.DATE,
        //   allowNull: false,
        //   defaultValue: Sequelize.NOW,
        //   comment: '수정일자'
        // },
        parentComId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        //   comment: '상위 댓글 아이디',
        //   references: {
        //     model: 'Comment',
        //     key: 'comId'
        //   }
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        //   comment: '삭제 여부'
        }
      }, {
        freezeTableName: true
        // timestamps: false
      });

    return Comment
}

module.exports = commentModel