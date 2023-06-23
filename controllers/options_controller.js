const Question= require('../models/question');
const Option= require('../models/option');

//function to add vote to an option
module.exports.add_vote= async function(req, res) {
    try {
        const option= await Option.findById(req.params.id);

        //increase the vote
        option.votes++;
        option.save();
        return res.redirect('back');
    }catch(err) {
        console.log(err);
        return res.redirect('back');
    }
}

//function to delete an option from a question
module.exports.delete= async function(req, res) {
    try {  

        //delete the option id from the corresponding question also
        var questions= await Question.find();

        for(q of questions) {
            for(op of q.options) {
                if(op._id == req.params.id) {
                    await Question.findByIdAndUpdate(q, { $pull: {options: op._id}});
                }
            }
        }

        //delete the corresponding option object
        await Option.findByIdAndDelete(req.params.id);
        
        req.flash('success', 'Option deleted successfully');
        return res.redirect('back');
    }catch(err) {
        //display error
        console.log(err);
        return res.redirect('back');
    }
}