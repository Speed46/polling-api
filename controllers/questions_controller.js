const Question= require('../models/question');
const Option= require('../models/option');

//function to create a new question
module.exports.create= async function(req, res) {
    try {
        var c=0;
        var options=[];

        //using all the form data to create the question object
        for(el in req.body) {
            if(c==0) {
                c++;
                continue;
            }

            //creating the option objects and adding them to an array
            var op= await Option.create({
                text: req.body[el]
            });
            op.option_no= c;
            op.votes= 0;
            op.link_to_vote= `https://polling-system-68ar.onrender.com/options/${op._id}/add_vote`;
            op.save();

            options.push(op);
            c++;
        }

        //now creating the question object
        var question= await Question.create({
            title: req.body.question_text,
            options: options
        });

        //we also put a reference to the question for each option
        for(op of options) {
            op.question= question._id;
            op.save();
        }
        req.flash('success', 'Question added successfully');
        
        return res.redirect('back');
    }catch(err) {
        console.log(err);
        return res.redirect('back');
    }
}

//function to delete a question
module.exports.delete= async function(req, res) {
    try {
        var question= await Question.findById(req.params.id);
        await Question.findByIdAndDelete(req.params.id);

        //deleting all the options of the questions also
        for(op of question.options) {
            await Option.findByIdAndDelete(op._id);
        }

        req.flash('success', 'Question deleted successfully');
        return res.redirect('back');
    }catch(err) {
        console.log(err);
        return res.redirect('back');
    }
}

//function to generate the api
module.exports.generate_api= async function(req, res) {
    try {

        //getting all the questions data from database and populating its options also
        var questions= await Question.find()
        .populate({
            path: 'options'
        });

        var result=[];
        for(q of questions) {
            var r={};
            r["title"]= q.title;
            var options=[];
            for(op of q.options) {
                options.push({
                    option_no: op.option_no, 
                    text: op.text,
                    votes: op.votes,
                    link_to_vote: op.link_to_vote
                });
            }
            r["options"]= options;
            result.push(r);
        }
        console.log(result);

        //returning the response to the browser
        return res.json(200, result);
    }catch(err) {

    }
}