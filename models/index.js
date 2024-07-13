const Sequelize = require('sequelize'); // sequelize 패키지 불러오기

// db 연결 정보
const config = require(__dirname + '/../config/config.js');

const db = {}; // 빈 객체

// config 안에 있는 데이터를 가지고 새로은 Sequelize 객체 생성
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// 모델 불러오기
const UserModel = require('./user/User')(sequelize, Sequelize); // user 모델의 파라미터로 전달
const PostModel = require('./post/Post')(sequelize, Sequelize); // post 모델의 파라미터로 전달
const CommentModel = require('./comment/Comment')(sequelize, Sequelize); // comment 모델의 파라미터로 전달

// 관계 연결
// User 모델과 Post 모델 간의 관계 설정
UserModel.hasMany(PostModel, { foreignKey: 'userId' });
PostModel.belongsTo(UserModel, { foreignKey: 'userId' });

// Post 모델과 Comment 모델 간의 관계 설정
PostModel.hasMany(CommentModel, { foreignKey: 'postId' });
CommentModel.belongsTo(PostModel, { foreignKey: 'postId' });

// User 모델과 Comment 모델 간의 관계 설정
UserModel.hasMany(CommentModel, { foreignKey: 'userId' });
CommentModel.belongsTo(UserModel, { foreignKey: 'userId' });

// Comment 모델과 자신(댓글) 간의 관계 설정
CommentModel.hasMany(CommentModel, {
  as: 'replies',
  foreignKey: 'parentComId',
});
CommentModel.belongsTo(CommentModel, {
  as: 'parentComment',
  foreignKey: 'parentComId',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db 에 만든 모델 집어넣기
db.User = UserModel;
db.Post = PostModel;
db.Comment = CommentModel;

// db 객체를 내보내기 -> 다른 파일에서 db모듈 사용 예정
module.exports = db;
