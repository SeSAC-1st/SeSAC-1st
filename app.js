const express = require('express');
const app = express();
const PORT = 8000;
const { swaggerUi, specs } = require('./modules/swagger');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const idxRouter = require('./routes/index');
app.use('/', idxRouter);




app.get('*', (req, res) => {
    res.render('404');
})

app.listen(PORT, () => {
    console.log(`Sever is running! The port number is ${PORT} ...`);
})