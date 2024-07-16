const express = require('express');
const app = express();
const sessionMiddleware = require('./middlewares/session');
const { sequelize } = require('./models');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user/user');
const postRouter = require('./routes/post/post');
const commentRouter = require('./routes/comment/comment');

const path = require('path')
const dotenv = require('dotenv')

// dotenv 모듈을 이용해 .env 파일의 환경 변수를 불러옴
dotenv.config({
    // 기본 .env 파일 로드
    path: path.resolve(__dirname, '.env')    
})

// process.env 객체를 통해 환경 변수에 접근, .env 파일에서 작성한 포트번호가 대입
const port = process.env.PORT || 5000

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionMiddleware);

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/static', express.static(__dirname + '/static'));


app.get('*', (req, res) => {
    res.render('404')
})

// 테이블을 생성하고 처음에만 force : true 로 실행하고 그 뒤로는 false로 변경하고 실행
sequelize
    .sync({ force: true

     })    // force : true -> 서버 실행때마다 테이블 재생성(데이터 다 날아감), false -> 서버 실행 시 테이블 없으면 생성
    .then(() => {
        app.listen(port, () => {
            console.log('database connection succeed');
            console.log(`http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error(err)
    })