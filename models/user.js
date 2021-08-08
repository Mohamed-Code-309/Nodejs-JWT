const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate:[isEmail, 'Please enetr a valid email']
        
    },
    password : {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, 'Minimum password length is 6 characters']
    }
})

//Mongo Hooks:
//fire a function after a new user is saved in the database
userSchema.post('save', function(doc, next){
    console.log('New User is created', doc);
    next(); //it will make postman hang, it is mandatory
})


//bcrypt part
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);  
    next();
})

//Static method to login user
userSchema.statics.login = async function(email, password){
    //find the document that contains the email
    const user = await this.findOne({ email : email}) 
    if(user){ //user exist
        //compare password : hash the passowrd and then compare it to the hashed password stored in the database
        //using compare method
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user
        }
        throw Error('Incorrect Password')
    }
    //email not exist
    throw Error('Incorrect Email')
}

const user = mongoose.model('user', userSchema); 

module.exports = user;
