import express from 'express'
import path from 'path'
import mysql from 'mysql'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const app = express();
const PORT = 8082;
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+ '/public'));
app.use(express.static(path.resolve('views')));

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
});
//////////CONECT DB////////////
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'tubespbw'
    });

connection.connect(function(err) {
    if (err) {
          console.error('error connecting: ' + err.stack);
          return;
    }
       
        console.log('Connected to DB');
});
//////////////////




///////////router//////////////////
app.get('/', (req,res) => {
    res.render('landingpage');
})
app.get('/login', (req,res) => {
    res.render('login');
})
app.get('/signup', (req,res) => {
    res.render('signup');
})
app.get('/homepage', (req,res) => {
    res.render('homepage');
})
app.get('/mythreads', (req,res) => {
    res.render('mythreads');
})
app.post('/signup', (req,res) => {
    let sql = `INSERT INTO users (name, password, joined_date) VALUES ('${req.body.username}','${req.body.password}','${new Date().toISOString().slice(0, 19).replace('T', ' ')}')`
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
      res.redirect("/login")
})

app.get('/logincheck', (req,res) => {
    let sql = `(SELECT count(users.id) as jumlah from users where name='${req.query.username}' and password='${req.query.password}')`
    connection.query(sql, function (err, result) {
        if (err) throw err;;
        if(result[0].jumlah>0){
            res.redirect("/homepage")
        }
        else{
            res.redirect("/login")
        }
      }); 
})

app.get('/homepageget/*', (req,res) => {
    let value=req.params[0]
    if (req.params[0]==undefined){
        value='';
    }
    let sql = `(SELECT threads.title as title, users.name as usrname, thread_categories.name as category, threads.created_date as creat from threads inner join users on threads.author_id=users.id inner join thread_categories on thread_categories.id=threads.category_id where title like '%${value}%')`
    connection.query(sql, function (err, result) {
        if (err) throw err;;
        res.send(result)
      }); 
})

app.get('/myhomepageget/*', (req,res) => {
    let par=req.params[0]
    const arr=par.split("/")
    let name=arr[0]
    let value=arr[1]
   if (req.params[0]==undefined){
        value='';
    }
    let sql = `(SELECT threads.title as title, users.name as usrname, thread_categories.name as category, threads.created_date as creat from threads inner join users on threads.author_id=users.id inner join thread_categories on thread_categories.id=threads.category_id where title like '%${value}%' and users.name='${name}')`
    connection.query(sql, function (err, result) {
        if (err) throw err;;
        res.send(result)
      }); 
})
/////////////////////
