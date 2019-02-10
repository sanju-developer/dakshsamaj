const db = require('../config/databse');
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    // jwt verify will return decode value from token
    try{
        const decode = jwt.verify(req.body.token, db.JWT_KEY);
        next(); 
    }catch(err) {
        res.status(401).json({
            stautus:0,
            msg:'Auth Failed, please provide token'
        });
    }
}