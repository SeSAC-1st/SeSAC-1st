// Post 테이블 모델

const postModel = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      postId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      postTitle: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      postContent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return Post;
};

module.exports = postModel;
