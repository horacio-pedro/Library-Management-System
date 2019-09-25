//declaration
const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');

const app = express();

//common controllers
const signup = require('./controllers/signupController');
const login = require('./controllers/loginController');
const logout = require('./controllers/logoutController');

//admin controllers
const admin = require('./controllers/adminController');


//customer controllers
const customer = require('./controllers/customerController');

//configure
app.set('view engine', 'ejs');
app.use(session({
	secret: "SystemSecurity#2019",
	resave: true,
	saveUninitialized: true,
	cookie: { secure: true }
}))
app.use(flash());

app.use((req, res, next) => {
	res.locals.message = req.flash('message');
	next();
});

//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressSession({
	secret: 'my top secret pass', 
	resave: false, 
	saveUninitialized: true
}));
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
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
