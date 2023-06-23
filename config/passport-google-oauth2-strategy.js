//to give user option to sign in or sign up with google

//libraries which are required
const passport= require('passport');
const googleStrategy= require('passport-google-oauth').OAuth2Strategy;
const crypto= require('crypto');
const User= require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID:  "403523148406-rdtj17etq2d5grgumd52lkcco4s82orp.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "https://polling-system-68ar.onrender.com/users/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        //find a user
        User.findOne({email: profile.emails[0].value})
            .then((user)=> {
                console.log(profile);
                if(user) {
                    console.log('Found user using google');

                    //if found, set this user as req.user
                    return done(null, user);
                }
                else {
                    console.log('Cannot Found user using google');

                    //if not found, create the user and set it as req.user
                    User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: crypto.randomBytes(20).toString('hex')
                    })
                    .then((user)=> {
                        return done(null, user);
                    })
                    .catch((err)=> {
                        console.log('Error in creating user google strategy passport', err);
                        return;
                    })
                }
            })
            .catch((err)=> {
                //display error if any
                console.log('Error in google strategy passport', err);
                return;
            })
            
        })
);

module.exports= passport;