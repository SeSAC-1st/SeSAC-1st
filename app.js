const express = require('express');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('static')); // static폴더를 내가 static파일을 가져오는 폴더로 등록한다

app.listen(PORT, () => {
  console.log(`Sever is running! The port number is ${PORT} ...`);
});
