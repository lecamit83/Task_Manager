const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new Schema({
    name : {
        type : String,
        require : true,
        trim : true
    },
    email: {
        type : String,
        trim : true,
        require : true,
        unique : true,
        lowercase : true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid!");
            }
        }
    },
    password : {
        type: String,
        trim : true,
        require : true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens : [{
        token : {
            type : String,
            require : true
        }
    }]
}, {
    timestamps : true   
});

userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
});

userSchema.methods.toJSON = function () {
    const user = this;

    const objectUser = user.toObject();

    delete objectUser.password;
    delete objectUser.tokens;

    return objectUser;
}

userSchema.methods.generateAuthenticationToken = async function () {
    const user = this;

    const token = await jwt.sign({_id : user._id.toString()} , 'ThanToanDoc', {expiresIn : '7 days'});

    
    user.tokens = user.tokens.concat({ token });

    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
     
    const user = await User.findOne({ email });
    if( !user ){
        throw new Error("Unable to Login");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to Login');
    }
    return user;
}

userSchema.pre('save', async function(next){
    const user = this;
    //console.log('before saving');
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function(next){
    const user = this;
   // console.log('before removing');

    await Task.deleteMany({owner : user._id});
    
    next();
    
})
const User = mongoose.model('User', userSchema);

module.exports = User;