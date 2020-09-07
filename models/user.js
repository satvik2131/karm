const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validate = require('validator')
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            const res = validate.isEmail(value)
            if(!res){
                throw new Error('email is not validated')
            }
        }
          },
    password:{
        type:String,
        required:true,
        validate: {
            validator: function(pass) {
              let regex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})'
              return pass.match(regex)
            },
          },
        minlength:8,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


//instance method  --> it is for every instance of a user
userSchema.methods.getAuthTokens = async function(){
    const user = this;
    const token =  jwt.sign({_id: user._id.toString()},'superisupar');

    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token;
}


// Register User Pre middleware
userSchema.pre('save',async function (next) {
    const user = this
    try{
        if(!user){
            throw new Error('No user')
        }

        if(user.isModified('password')){
            user.password = await bcrypt.hash(user.password,8)
        }

        next()

    } catch (e) {
        console.log(e.message)
    }
    
}) 


const user = mongoose.model('User',userSchema)

module.exports = user

