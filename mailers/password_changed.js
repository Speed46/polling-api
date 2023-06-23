//format for sending mail for changing password

const nodeMailer= require('../config/nodemailer');
const User= require('../models/user');

exports.resetSuccess= async (user)=> {
    let htmlString= nodeMailer.renderTemplate({user: user}, '/resetPassword/password_changed.ejs');
    let reqEmail;

    /*
    here async await is imp because the below nodemailer statements are executing first before the User.findOne() statement, 
    so thats why error is coming, so to avoid this we must do async await so that other statements wait before first statement is executed
    */
    reqEmail= user.email
    console.log(reqEmail);
    
    nodeMailer.transporter.sendMail({
        from: 'pbpiyush34@gmail.com',
        to: reqEmail,
        subject: "Password changed",
        html: htmlString
    }, (err, info)=> {
        if(err) {
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent ', info);
        return res.redirect('back');
    });
}