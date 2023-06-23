const Question= require('../models/question');
const Option= require('../models/option');

//this function redirects user to home page
module.exports.home= async function(req, res) {
    try {
        //fetching all questions from database and also populating the options object
        var questions_list= await Question.find()
        .populate({
            path: 'options'
        });
        
        return res.render('user/home', {
            layout: 'user/layout',
            btn_text: 'Sign Out',
            form_action: '/users/sign-out',
            questions_list: questions_list
        });
    }catch(err) {

    }
}