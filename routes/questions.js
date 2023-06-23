const express= require('express');
const router= express.Router();

//passport for authentication
const passport= require('passport');
const questions_controller= require('../controllers/questions_controller');

//get requests
router.post('/create', passport.checkAuthentication, questions_controller.create);
router.get('/generate_api', questions_controller.generate_api);
router.get('/delete/:id', passport.checkAuthentication, questions_controller.delete);

module.exports= router;