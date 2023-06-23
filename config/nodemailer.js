//this is used for mailing to user when user sign in or reset his passoword

const nodemailer= require('nodemailer');
const ejs= require('ejs');
const path= require('path');

//this is the part which sends the email
/*
NOTE: use this link to get app password for your gmail id because google has removed the option of less secure app login
https://support.google.com/accounts/answer/185833
*/

let transporter= nodemailer.createTransport(
    {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: '587',
        secure: true,
        auth: {
            user: 'pbpiyush34@gmail.com',
            pass: 'vgkhbvyqhnucryav'
        }
    }
);

//defines when i send html email then where the files will be placed inside views/mailers
let renderTemplate= (data, relativePath)=> {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template) {
            if(err) {
                console.log('Error in rendering template ', err);
                return;
            }
            mailHTML= template;
        }
    )
    return mailHTML;
}

module.exports= {
    transporter: transporter,
    renderTemplate: renderTemplate
}