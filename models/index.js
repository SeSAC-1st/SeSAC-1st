const Sequelize = require('sequelize');     // sequelize 패키지 불러오기

// db 연결 정보
const config = require(__dirname + '/../config/config.js');  
console.log('config', config);  

const db = {};   // 빈 객체

// config 안에 있는 데이터를 가지고 새로은 Sequelize 객체 생성
const sequelize = new Sequelize(config.database, config.username, config.password, config);


// 모델 불러오기
// const UserModel = require('./user/User')(sequelize, Sequelize)   // user 모델의 파라미터로 전달
// const PostModel = require('./post/Post')(sequelize, Sequelize)   // post 모델의 파라미터로 전달
const CommentModel = require('./comment/Comment')(sequelize, Sequelize)   // comment 모델의 파라미터로 전달


// 관계 연결
// 1. player : profile = 1:1
// PlayerModel.hasOne(ProfileModel, {
//   // CASCADE 옵션으로 player가 삭제/수정되면 profile도 함께 삭제/수정
//   onDelete : 'CASCADE',   
//   onUpdate : 'CASCADE',

//   // ProfileModel에 'player_id' 이름의 fk 생성
//   foreignKey : 'player_id',    
//   // foreignKey : {
//   //   name : 'player_id',
//   //   allowNull : false
//   // },

//   // PlayerModel 의 'player_id' 컬럼 참조
//   sourceKey : 'player_id',
// })
// ProfileModel.belongsTo(PlayerModel, {    // profile(자식 테이블), player(부모 테이블)
//   // ProfileModel 의 'player_id' 라는 fk 생성
//   foreignKey : 'player_id',
//   // foreignKey : {
//   //   name : 'player_id',
//   //   allowNull : false
//   // },

//   // 참조할 PlayerModel 의 키는 'player_id'
//   targetKey : 'player_id',
// })

// // 2. team : player = 1:N
// TeamModel.hasMany(PlayerModel, {
//   // PlayerModel 에 'team_id' fk 생성
//   foreignKey : 'team_id',
//   // TeamModel 의 'team_id' 컬럼 참조
//   sourceKey : 'team_id',
// })
// PlayerModel.belongsTo(TeamModel, {
//   // PlayerModel 에 'team_id' fk 생성
//   foreignKey : 'team_id',
//   // 참조할 TeamModel 의 키는 'team_id'
//   targetKey : 'team_id',
// })

// // 3) Team : Game = N : M
// // 하나의 팀은 여러 게임 가능, 한 게임에는 여러 팀이 참여
// // 두 모델의 관계 모델은 TeamGameModel
// TeamModel.belongsToMany(GameModel, {
//   through: TeamGameModel, // 중계(관계) 테이블
//   foreignKey: 'team_id', // TeamGameModel에서 TeamModel을 참조하는 fk
//   otherKey: 'game_id', // TeamGameModel에서 GameModel을 참조하는 fk
//   // as: 'games'
// });
// GameModel.belongsToMany(TeamModel, {
//   through: TeamGameModel, // 중계(관계) 테이블
//   foreignKey: 'game_id', // TeamGameModel에서 GameModel을 참조하는 fk
//   otherKey: 'team_id',  // TeamGameModel에서 TeamModel을 참조하는 fk
//   // as: 'teams'
// });
// TeamGameModel.belongsTo(TeamModel, {
//   foreignKey: 'team_id',
//   // as : 'team'
// })
// TeamGameModel.belongsTo(GameModel, {
//   foreignKey: 'game_id',
//   // as : 'game'
// })


db.sequelize = sequelize;
db.Sequelize = Sequelize;


// db 에 만든 모델 집어넣기
// db.User = UserModel
// db.Post = PostModel
db.Comment = CommentModel

// db 객체를 내보내기 -> 다른 파일에서 db모듈 사용 예정
module.exports = db;
