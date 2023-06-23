//local strategy for passport authentication
const passport= require('passport');
const LocalStrategy= require('passport-local').Strategy;
const User= require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    },
    function(req, email, password, done) {
        //find a user and establish the identity
        User.findOne({
            email: email
        }) .then((user) => {
            if(!user || user.password != password) {
                req.flash('error', 'Invalid Username/Password');
                // console.log('Invalid Username/Password');
                return done(null, false); //error is null and authentication is false
            }
            
            console.log('done this func');
            return done(null, user);
        }) .catch((err) => {
            req.flash('error', err);
            // console.log('Error in finding user --> Passport',err);
            return done(err);
        })
    }
));

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done) { //inbuilt function
    done(null, user.id); //this will encrypt the user.id and put it in the cookie
});

//deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(id)
    .then((user) => {
        return done(null, user);
    }) .catch((err) => {
        console.log('Error in finding user --> Passport',err);
        return done(err);
    })
});

//check if the user is authenticated
passport.checkAuthentication= function(req, res, next) {
    //if user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()) {
        return next();
    }

    //if user is not signed in
    console.log('here2');
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser= function(req, res, next) {
    if(req.isAuthenticated()) {
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user= req.user;
    }
    console.log('yoy');
    next();
}

module.exports= passport;