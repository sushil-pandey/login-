const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
       
    },
    email: {
        type: String,
        
    },
    password: {
        type: String,
        
    },
//     created_at    : { type: Date },
//   updated_at    : { type: Date },
createdAt: { type: 'string', columnType:'date', autoCreatedAt: true, },
    updatedAt: { type: 'string', columnType:'date', autoUpdatedAt: true, },
    saltSecret: {
        String
    }
});

 

// Events
userSchema.pre('save', function (next) {
    now = new Date();
  this.createdAt = now;
  this.updatedAt=now;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}

mongoose.model('User', userSchema);