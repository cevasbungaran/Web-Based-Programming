import express from 'express'
import path from 'path'

const app = express();
const PORT = 8082;

app.set('view engine', 'ejs');
//app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('views')));

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
});

app.get('/login', (req,res) => {
    res.render('login');
})

