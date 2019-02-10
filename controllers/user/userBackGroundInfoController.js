const UserBackgroundInfo = require('../../models/user/userBackGroundInfoModel');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const async = require('async');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/databse');


const userBackGroundInfoController = async (req, res) => {
    try {
        const UserBackgroundInfoObject = new UserBackgroundInfo({
            name: req.body.name,
            lastname: req.body.lastname,
            contact: req.body.contact,
            address: req.body.address,
            caste: req.body.caste,
            city: req.body.city,
            area: req.body.area,
            email: req.body.email,
            password: req.body.password,
            age: req.body.age,
            dob: req.body.dob,
            gender: req.body.gender,
            married: req.body.married,
            state: req.body.state,
            fathers_name: req.body.fathers_name,
            occupation: req.body.occupation,
            no_of_family_member: req.body.no_of_family_member,
            created_date: req.body.created_date
        });

        var hash = bcrypt.hashSync(req.body.password, 10);
        UserBackgroundInfoObject.password = hash;

        if(UserBackgroundInfoObject){
            if(await UserBackgroundInfo.findOne({email: req.body.email})){
                res.status(201).json({
                    err:'Email already exist',
                    status:0
                });
            }else{
                // generate jwt token and sent it on registeration of user
                const token = jwt.sign(
                    {
                        email:UserBackgroundInfoObject.email,
                        password:UserBackgroundInfoObject.password
                    },
                    db.JWT_KEY,
                    {
                        expiresIn: 86400 // expires in 24 hours
                    }
                );
                UserBackgroundInfoObject.save((err,doc) => {
                    if(err){
                        res.status(201).json({
                            err: 'Something went wrong',
                            status:0,
                            err
                        });
                    }else{
                        res.status(200).json({
                            msg: 'Thankyou for showing interest',
                            status:1,
                            resposne: doc,
                            authtoken:token
                        });
                    }
                });
            }
        }else{
            res.status(201).json({
                err:'Please enter the details',
                status:0
            });
        }
    } catch (error) {
        throw error;
        console.log(error);
    }

}

userPersonalInfoController = module.exports = { userBackGroundInfoController };
