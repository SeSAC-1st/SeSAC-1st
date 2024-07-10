const commentModel = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      comId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      comContent: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'Post',
        //   key: 'postId',
        // },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'User',
        //   key: 'userId',
        // },
      },
      parentComId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: {
        //   model: 'Comment',
        //   key: 'comId',
        // },
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

  return Comment;
};

module.exports = commentModel;
