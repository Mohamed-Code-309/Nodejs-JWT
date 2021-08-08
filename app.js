const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleWare');

const app = express();

// middleware
app.use(express.static('public'));

app.use(express.json());
app.use(cookieParser()) 

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI ='mongodb+srv://mohamed:nn4CdkD7GFD53AnI@cluster0.kngjr.mongodb.net/test'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000)) 
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth , (req, res) => res.render('smoothies'));

const authRoutes = require('./routes/authRoutes')
app.use(authRoutes); 


//Cookies (test)
app.get('/set-cookies', (req, res) => {

  res.setHeader('Set-Cookie','newUser=ahmed') //the second argument is the cookie value(name+value)
  //when we send response to the browser, it is going to send this cookie with it
  
  res.cookie('Name','Mohamed'); //cookie-parser
  res.cookie('Name2','Gamal', { maxAge: 1000 * 60 * 60 * 24}); //, secure: true   , 
  //httpOnly: true : can access and change if from the javascript front-end code
  //a day : will remove from the browser after 1 day 
  res.send('you got the cookie');
})


app.get('/read-cookies', (req, res) => {
  
  const cookies = req.cookies;
  console.log(cookies)

  //we can use dot notations to get the different cookies that we want to access
  console.log(cookies.Name)

  res.json(cookies)
})