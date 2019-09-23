//declaration
const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

//common controllers
const signup = require('./controllers/signup');
const login = require('./controllers/login');
const logout = require('./controllers/logout');

//admin controllers
const admin = require('./controllers/admin');


//customer controllers
const customer = require('./controllers/customer');

//configure
app.set('view engine', 'ejs');

//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressSession({secret: 'my top secret pass', resave: false, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', function(req, res, next){

	if(req.originalUrl == '/login' || req.originalUrl == '/signup')
	{
		next();
	}
	else
	{
		if(!req.session.admin && !req.session.customer)
		{
			res.redirect('/login');
			return;
		}
		next();
	}
});


//routes
app.use('/login', login);
app.use('/signup', signup);
app.use('/logout', logout);

//admin routes
app.use('/admin', admin);


//customer routes

app.use('/customer', customer);

//server start
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});
