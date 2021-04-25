const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
let HTML = fs.readFileSync(`${__dirname}/index.html`);

app.use('/css', express.static(__dirname + '/public/css'));

app.use('/',(req, res, next)=>{
  //console.log('someone made a request !! ' + req.url);
  res.cookie('CookieName', 'cookie value');
  next();
})

app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded({extended:false});

const hello = (req, res, next) => {
  console.log('hello');
  next();
}

app.get('/', hello, (req, res) => {
  res.end(HTML);
});

app.get('/api/user/:id', (req, res) => {
  let id = req.params.id;
  res.send(`<html>
    <body>
      <h1 style="background:red">The user id is ${id}</h1>
    </body>
  </html>`);
  // res.send({
  //   name: 'francis',
  //   lastname: 'jones'
  // });
});
app.get('/api/car',(req,res)=>{
  let brand=req.query.brand;
  let model=req.query.model;
  res.send({
    brand,
    model
  })
})

app.get('/user',(req,res)=>{
  let USER_HTML = fs.readFileSync(`${__dirname}/views/user.html`);
  res.end(USER_HTML);
})

app.get('/userquery',(req,res)=>{
  let FORM_HTML = fs.readFileSync(`${__dirname}/views/form.html`);
  res.end(FORM_HTML);
})

app.post('/api/adduser',(req,res)=>{
  console.log(req.body);
  res.sendStatus(200);
})

app.post('/api/queryadd',urlencodedParser,(req,res)=>{
  console.log(req.body);
  const firstname=req.body.firstname;
  const lastname=req.body.lastname;
  console.log(`${firstname}`);
  console.log(`${lastname}`);
  res.sendStatus(200);
})

const port = process.env.PORT || 3000;
app.listen(port);
