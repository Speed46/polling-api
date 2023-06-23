//using express
const express= require('express');

const cookieParser= require('cookie-parser'); //to create and edit cookies
const app= express();

const port= 8000;

const expressLayouts= require('express-ejs-layouts'); //to use layouts in ejs file

const db= require('./config/mongoose'); //connecting to mongoose to get access to database

//used for create session cookie which is used by passport.js to setup the identity of user
const session= require('express-session');
const passport= require('passport');
const passportLocal= require('./config/passport-local-strategy'); //we are using passport local strategy now
const passportGoogle= require('./config/passport-google-oauth2-strategy'); //to use google to signin

//using mongo store to store the session cookies in mongodb database to increase the time of cookie expiration
const MongoStore= require('connect-mongo');

//to convert scss files to css file
// const sassMiddleware= require('node-sass-middleware');

//to display flash messages to user(NOTY is needed to be included at each .ejs page)
const flash= require('connect-flash');
const customMware= require('./config/middleware'); //middleware for flash messages

/*
//telling the express app to use sass middleware before the server runs, so that we can convert scss file to css file
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));*/

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


//this is compulsary to inlcude
app.use(express.urlencoded());

//telling express app to use cookie parser
app.use(cookieParser());

//telling the express app that for static files look into assets folder
app.use(express.static('./assets'));

//telling to use express layouts and extract the stylesheets and script files and place them as specified in layout.ejs
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//setup view engine, for all ejs files use views folder
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the db
const mongoose= require('mongoose');
app.use(session({
    name: 'codeial',
    //change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    /*cookie: {
        maxAge: (1000*60*100) //after this time, cookie expires (milliseconds)
    },*/
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb+srv://piyush:piyushbhat@cluster0.uv1du9w.mongodb.net/?retryWrites=true&w=majority',
            autoRemove: 'disabled'
        },
        function(err) {
            console.log(err, 'connect-mongodb setup ok');
        }
    )
    }));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes')); //must place this line after passport lines

app.listen(port, function(err) {
    if(err) {
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
})