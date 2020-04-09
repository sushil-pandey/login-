const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
var nodemailer = require('nodemailer');
const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    // if (!user.name) { return res.status().send({ error: 'Missing name' }); }
    user.save((err, doc) => {
        if (!err)
        
            res.send(doc);
        else  {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }
    }
    )
}


module.exports.authenticate = (req, res,next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res,next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['name','email']) });
        }
    );
}


// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'speaktosushil@gmail.com',
//       pass: 'Pandey@1993'
//     }
//   });
  
//   var mailOptions = {
//     from: 'speaktosushil@gmail.com',
//     to: user.email,
//     subject: "Please confirm your Email account" + user.email,
//     text:      'that' 
//   };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });