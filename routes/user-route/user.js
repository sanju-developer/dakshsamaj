const express = require('express');
//const router = express.Router();
const router = require('express-promise-router')();
const User = require('../../models/user/usermodel');
const controller = require('../../controllers/user/userControllers');
const userPersonalInfoController = require('../../controllers/user/userBackGroundInfoController');
const AuthCheck = require('../../auth-check/AuthCheck');


// User Registeration
router.post('/register', (req, res) => {
    controller.registeration(req, res);
});

//Login API
router.post('/login', (req, res) => {
    controller.login(req, res);
});

// protected route with the help of JWT
router.post('/get-details', AuthCheck, (req, res, next) => {
    res.status(200).json({
        msg:'token recieved'
    });
});

router.post('/submit-info', (req,res) => {
    userPersonalInfoController.userBackGroundInfoController(req, res);
})

router.post('/forgot-password', (req,res,next) =>{
    controller.forgotPassword(req, res);
});
module.exports = router;
