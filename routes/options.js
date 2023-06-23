const express= require('express');
const router= express.Router();

//passport for authentication
const passport= require('passport');

//option controller
const options_controller= require('../controllers/options_controller');

//get requests
router.get('/:id/add_vote', passport.checkAuthentication, options_controller.add_vote);
router.get('/delete/:id', passport.checkAuthentication, options_controller.delete);

module.exports= router;