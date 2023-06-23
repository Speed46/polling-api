//model for options

const mongoose= require('mongoose');
const optionSchema= new mongoose.Schema({
    option_no: {
        type: String
    },
    text: {
            type: String,
            required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    link_to_vote: {
        type: String,
    },
    //reference to the question to which it belongs
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }
}, {
    timestamps: true
});

const Option= mongoose.model('Option', optionSchema);
module.exports= Option;