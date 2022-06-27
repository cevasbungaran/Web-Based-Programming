import express from 'express'
import path from 'path'
import mysql from 'mysql'
import {fileURLToPath} from 'url';
import bodyParser from 'body-parser'


const app = express();
const PORT = 8082;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//post
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//
app.set('view engine', 'ejs');
//get
app.use(express.urlencoded({ extended: true }));
//
//css
app.use(express.static(__dirname+ '/public'));
//
app.use(express.static(path.resolve('views')));
//img
app.use(express.static(__dirname+ '/img'));
//
app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
});
//////////CONECT DB////////////
let connection = mysql.createConnection({
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
    
    let sql = `INSERT INTO users (name, nickname, email, password, joined_date) VALUES ('${req.body.username}','${req.body.nickname}','${req.body.email}','${req.body.password}','${new Date().toISOString().slice(0, 19).replace('T', ' ')}')`
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
      res.redirect("/login")
})

app.post('/threadpost', (req,res) => {
    let sql2 = `(select id from users where name='${req.body.name}')`
    let id=0
    connection.query(sql2, function (err, result) {
        if (err) throw err;
        id=result[0].id
  
        let sql = `INSERT INTO threads (title, author_id, category_id, created_date) VALUES ('${req.body.title}','${id}','${req.body.category}','${new Date().toISOString().slice(0, 19).replace('T', ' ')}}')`
        connection.query(sql, function (err, result) {
           if (err) throw err;  
           console.log("1 record inserted");
         });  
    });
  
})

app.post('/subcomment', (req,res) => {
        let sql = `INSERT INTO thread_contents (content, like_count, created_date,thread_id) VALUES ('${req.body.content}','0','${new Date().toISOString().slice(0, 19).replace('T', ' ')}','${req.body.idThread}')`
        connection.query(sql, function (err, result) {
           if (err) throw err;  
           console.log("1 record inserted");
         });
         res.send('success')
  
})

app.get('/threadcomment/*', (req,res) => {
        let sql = `(select * from thread_contents where thread_id=${req.params[0]})`
        connection.query(sql, function (err, result) {
           if (err) throw err;  
           res.send(result)
         });
  
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
    let sql = `(SELECT threads.id as id,threads.title as title, users.name as usrname, thread_categories.name as category, threads.created_date as creat from threads inner join users on threads.author_id=users.id inner join thread_categories on thread_categories.id=threads.category_id where title like '%${value}%' or thread_categories.name like '%${value}%' order by created_date desc)`
    connection.query(sql, function (err, result) {
        if (err) throw err;;
        res.send(result)
      }); 
})

app.get('/threadcategory', (req,res) => {
    let sql = `(SELECT * from thread_categories)`
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
    let sql = `(SELECT threads.id as id,threads.title as title, users.name as usrname, thread_categories.name as category, threads.created_date as creat from threads inner join users on threads.author_id=users.id inner join thread_categories on thread_categories.id=threads.category_id where title like '%${value}%' and users.name='${name}' or thread_categories.name like '%${value}%' order by created_date desc)`
    connection.query(sql, function (err, result) {
        if (err) throw err;;
        res.send(result)
      }); 
})
/////////////////////
