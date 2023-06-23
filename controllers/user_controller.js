//NOTE: cookie is deleted when browser is closed !!!!!

const User= require('../models/user');
const RPT= require('../models/reset_password_token');
const signinMailer= require('../mailers/signin_mailer');
const resetPassword_mailer= require('../mailers/resetPassword_mailer');
const password_changed= require('../mailers/password_changed');
const crypto= require('crypto');

//render the sign up page
module.exports.signUp= function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }  
    return res.render('login/signUp', {
        layout: 'login/layout',
        form_action: '/users/sign-in',
        btn_text: 'SignIn'
    })
};

//sign in page
module.exports.signIn= function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }  
    return res.render('login/signIn', {
        layout: 'login/layout',
        form_action: '/users/sign-up',
        btn_text: 'SignUp' 
    })
};

//home page
module.exports.home= function(req, res) {
    if(req.cookies.user_id) {
        User.findById(req.cookies.user_id)
        .then((user) => {
            if(user) {
                    Task.find({
                        user_id: req.cookies.user_id
                    }) .then( (tasks) => {
                        return res.render('todo/home', {
                            title : 'ToDo | Home',
                            welcome_text: `Welcome ${user.name},`,
                            user: user,
                            layout: 'todo/layout',
                            btn_text: 'Sign Out',
                            form_action: '/users/signUp',
                            tasks_list: tasks
                        })
                    })
                    .catch((err) => {
                            console.log('Error: ', err);
                    });
            } else {
                return res.redirect('/users/signIn');
            }})
        .catch((err) => {
            return res.redirect('/users/signIn');
        })
    }
    else {
        return res.redirect('/users/signIn');
    }
};

//creating new user and checking if he is already present
module.exports.createUser= function(req, res) {
    if(req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords dont match !!');
        return res.redirect('back');
    }

    User.findOne({
        email: req.body.email
    }) 
    .then((user) => {
        if(!user) {
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            .then ((user) => {
                req.flash('success', 'Sign up successful');
                return res.redirect('/users/sign-in');
            }) 
            .catch((err) => {
                req.flash('error', 'Error in creating user while signing up !!');
                return res.redirect('back');
            });
        }
        else {
            req.flash('error', 'User is already present !!');
            return res.redirect('/users/sign-in');
        }
    }) 
    .catch((err) => {
        req.flash('error', err);
    })
};

//checking login and then redirecting to home page
module.exports.checkLogin= function(req, res) {
    User.findOne({
        email: req.body.email
    }) .then((user) => {
        if(user) {
            if(user.password != req.body.password) {
                return res.redirect('back');
            }
            res.cookie('user_id', user.id);
            return res.redirect('/users/home');
        }
        else {
            return res.redirect('back');
        }
    }) .catch((err) => {
        console.log('error in finding user in sign in');
    })
};


//sign in and create session for the user
module.exports.createSession= async function(req, res) {
    let user= await User.findOne({
        email: req.body.email
    })
    console.log(user, req.user);
    if(!user) {
        user= await User.findOne({
            email: req.user.email
        })
    }
    
    req.flash('success', 'Logged In Successfully');
    console.log('Inside create-session: -', user);
    signinMailer.newSignin(user);
    return res.redirect('/');
};

//destroy session when user signed out
module.exports.destroySession= function(req, res) {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
    });
    req.flash('success', 'Logged Out Successfully');
    return res.redirect('/');
}

//used for sending otp when person reset his password
function generateRandomNumber() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math
    .random() * (maxm - minm + 1)) + minm;
}

//function which verifies the passwords
module.exports.getEmail= function(req, res) {
    return res.render('resetPassword/user_forgot_password', {
        layout: 'resetPassword/layout',
        form_action: '/users/sign-in',
        btn_text: 'Sign In'
    });
}

//page to reset password is redirected for user
module.exports.reset_password= async function(req, res) {
    var otp= generateRandomNumber();
    let user= await User.findOne({
        email: req.body.email
    })
    if(!user) {
        req.flash('error', 'Cant find user, plz sign up first');
        return res.redirect('/users/sign-up');
    }

    console.log(otp);

    let rpt= await RPT.create({
        accessToken: otp,
        isValid: 'true',
        user: user
    })
    console.log('Created rtp: ', rpt);
    resetPassword_mailer.resetPassword(rpt);
    return res.render('resetPassword/enter_otp', {
        layout: 'resetPassword/layout',
        form_action: '/users/sign-in',
        btn_text: 'Sign In',
        id: user.email
    });
}

//function which verifies otp for resetting password
module.exports.verify_otp= async function(req, res) {
    console.log(req.body.num);
    let user= await User.findOne({
        email: req.params.id
    })
    console.log('Verifying otp: ', user);
    console.log(req.body.num);
    let rpt= await RPT.findOne({
        user: user,
        isValid: 'true',
        accessToken: req.body.num
    })
    if(!rpt) {
        req.flash('error', 'Plz sign in properly');
        return res.redirect('/users/sign-in');
    }
    else {
        req.flash('success', 'Verified');
        return res.render('resetPassword/user_reset_password', {
            layout: 'resetPassword/layout',
            form_action: '/users/sign-in',
            btn_text: 'Sign In',
            id: req.params.id
        });
    }
}

//save new password in database
module.exports.save_password= async function(req, res) {
    try{
        let user= await User.findOne({
            email: req.params.id
        })
        console.log(user);
        let rpt= await RPT.findOne({
            user: user,
            isValid: 'true'
        })
        console.log(rpt);
        if(!rpt) {
            req.flash('error', 'Plz sign in properly');
            return res.redirect('/users/sign-in');
        }
        else {
            if(req.body.password==req.body.confirm_password) {
                rpt.isValid= 'false';
                let user= await User.findOne(rpt.user);
                user.password= req.body.password;
                user.save();
                
                password_changed.resetSuccess(user);
                req.flash('success', 'Password changed successfully');
                return res.redirect('/users/sign-in');
            }
        }
    }catch(err) {
        console.log('Error', err);
        return;
    }
}