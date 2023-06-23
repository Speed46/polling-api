const express= require('express');
const router= express.Router();

//using passport for authentication
const passport= require('passport');

//home controller
const home_controller= require('../controllers/home_controller');

//paths
router.use('/users', require('./users'));
router.use('/questions', require('./questions'));
router.use('/options', require('./options'));

//get request for home page
router.get('/', passport.checkAuthentication, home_controller.home);

module.exports= router;