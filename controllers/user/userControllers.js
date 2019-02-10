const User = require('../../models/user/usermodel');
const body_parser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/databse');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const async = require('async');


const registeration = async (req, res) => {
    try {
        // Create User Object
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        // Encrypt the password
        var hash = bcrypt.hashSync(req.body.password, 10);
        newUser.password = hash;

        if (await User.findOne({ email: req.body.email })) {
            res.status(402).json({
                msg: 'Email is already exist',
                status: 0
            });
        } else {
            const registereduser = await newUser.save();
            res.status(200).json({
                msg: 'user registered',
                response: registereduser,
                status: 1
            });
        }
    }
    catch (error) {
        res.status(402).json({
            msg: 'something went wrong',
            err: error
        });
    }
}

// Login API
const login = async (req, res) => {
    try {
        // check if user is already exist
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (user && await bcrypt.compareSync(req.body.password, user.password)) {
                // generate jwt token
                const token = jwt.sign(
                    {
                         email:user.email,
                         userId:user._id 
                    },
                    db.JWT_KEY,
                    {
                        expiresIn: '1h'
                    }
                );
                res.status(200).json({
                    msg: 'you are logged in',
                    status: 1,
                    authtoken:token
                });
                } else {
                    res.status(401).json({
                        msg: 'Please enter a valid credentials',
                        status: 0
                    });
                }
                } else {
                    // if user is not registered
                    res.status(400).json({
                        msg: 'User is not Registered',
                        status: 0
                    });
                }
    }
    catch (err) {
        res.status(402).json({
            msg: 'something went wrong',
            err: err
        });
    }
}

// forgot password api---part 1
// part 1 send email to user email and link is provided within it
const forgotPassword = async (req, res) => {
        if(await User.findOne({email: req.body.email})){
         async.waterfall([
           function(done){
             crypto.randomBytes(20, function(err, buff){
               var token = buff.toString('hex');
               done(err, token);
             });
           },
           function(token, done){
            User.findOne({ email: req.body.email }, function(err, user) {
            if (!user) {
                return res.json({success:false, msg:'email not exits'});
            }
           user.resetPasswordToken = token;
           user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        //    console.log('user.resetPasswordExpires',user.resetPasswordExpires)
           console.log('user object to be saved',user);
             user.save(function(err) {
               done(err, token, user);
             });
         });
         },
         function(token, User, done) {
           var transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
           user: 'vivekrajoriya.yugasa@gmail.com',
           pass: 'Vivek@yugasa123'
         }
         });
            var mailOptions = {
              from: 'vivekrajoriya.yugasa@gmail.com',
              to: User.email,
              subject: 'Node.js Password Reset',
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, function(err) {
              console.log('mail sent');
              done(err, 'done');
            });
          }
         ], function(err,result) {
          if (err) throw err;
          res.status(500).json({
            msg:result
          });
         });
       }else{
           res.status(401).json({
               status:0,
               msg:'User doesn\t exist'
           });
       }
    }


controller = module.exports = { registeration, login, forgotPassword };