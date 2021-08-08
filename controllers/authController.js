const User = require('../models/user')
const jwt =  require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const handleErrors = (err) => {
    console.log(err.message);

    let errors = { email: '', password:'' };

    if(err.code === 11000){
        errors.email = "this email is already registered";
        return errors; 
    }

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(error => {
            errors[error.properties.path] = error.properties.message; //populating the errors object above 
        })
    }

    //Incorrect Email
    if(err.message == "Incorrect Email"){
        errors.email = "that email is not registered"
    }

    //Incorrect Password
    if(err.message == "Incorrect Password"){
        errors.password = "that password in not correct"
    }
    
    return errors;
}

//JWT 
const maxAge = 3 * 24 * 60 * 60; //3 days
const createToken = (id) => {
    //id : belong to the user as we will use this function after creating the user
    //id will be used insied the payload + a secret we provide
    //create and return jwt
    return jwt.sign({id}, 'mohamed the ghost', {
        expiresIn: maxAge  //how long this jwt is going to be valid, accept time in seconds not millieseconds
    })
}

module.exports = {
    signup_get : function(req, res){
        res.render('signup')
    },

    login_get : (req, res) => {
        res.render('login')
    },

    signup_post : async (req, res) => {
        const {email, password} = req.body;
        try{
            const user = await User.create({email, password}); 
            
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge : maxAge * 1000 })
            res.status(201).json({user: user._id});
        }
        catch(err){

            const errors = handleErrors(err);

            res.status(400).json({errors})
        }

    },

    login_post : async (req, res) => {
        const {email, password} = req.body;
        try{
            const user = await User.login(email, password); 
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge : maxAge * 1000 })
            res.status(201).json({user: user._id}); 
        }
        catch(err){
            const errors = handleErrors(err)
            res.status(400).json({errors})
        }
    },

    logout_get : (req, res) => {
        //delete the jwt cookie >> we can't do that but ....
        //we can replace it with a blank cookie and a very very short/quickly expire data (1 millieSecond)
        res.cookie('jwt', '', { maxAge : 1})
        res.redirect('/');     
    }

} 