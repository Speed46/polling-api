//format for sending mail for resetting password

const nodeMailer= require('../config/nodemailer');
const User= require('../models/user');

exports.resetPassword= async (rpt)=> {
    console.log('Inside reset password mailer ', rpt.user.name);
    let htmlString= nodeMailer.renderTemplate({rpt: rpt}, '/resetPassword/reset_password.ejs');
    let reqEmail;

    /*
    here async await is imp because the below nodemailer statements are executing first before the User.findOne() statement, 
    so thats why error is coming, so to avoid this we must do async await so that other statements wait before first statement is executed
    */
    try {
        let user= await User.findOne({
            _id: rpt.user._id
        })
        console.log('Found user: ', user);
        reqEmail= user.email
    }catch(err) {
        console.log('Error', err);
        return;
    }
    
    console.log(reqEmail);
    nodeMailer.transporter.sendMail({
        from: 'pbpiyush34@gmail.com',
        to: reqEmail,
        subject: "Verify to reset password",
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