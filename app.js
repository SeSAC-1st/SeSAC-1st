const express = require('express');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(__dirname + '/static'));

app.listen(PORT, () => {
  console.log(`Sever is running! The port number is ${PORT} ...`);
});
