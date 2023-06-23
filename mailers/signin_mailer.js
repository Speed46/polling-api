//format for sending mail for sigining in

const nodeMailer= require('../config/nodemailer');

exports.newSignin= (user)=> {
    console.log('Inside new signin mailer');
    let htmlString= nodeMailer.renderTemplate({
        user: user,
        host: 'localhost:8000'
    }, '/newSignin/new_signin.ejs');

    nodeMailer.transporter.sendMail({
        from: 'pbpiyush34@gmail.com',
        to: user.email,
        subject: "New SignIn with your account",
        html: htmlString
    }, (err, info)=> {
        if(err) {
            console.log('Error in sending mail', err);
            return;
        }
        req.flash('success', 'Message sent');
        return res.redirect('back');
    });
}