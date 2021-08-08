const jwt = require('jsonwebtoken');
const User = require('../models/user')

const requireAuth = (req, res, next) => {
    //1.grab the token from the cookies
    const token = req.cookies.jwt; //jwt: name of the cookie we use to store json web token
    
    //check the token exist and verify it
    if(token){
        //token + secret we used when we create the token in createToken function in authController
        jwt.verify(token, 'mohamed the ghost', (err, decodedToken) => {
            if(err){ 
                console.log(err.message)
                res.redirect('/login')
            }
            else{
                //there is a valid user logged in
                console.log(decodedToken);
                next(); //carry on with what you are doing 
            }
        }); 
        
    }
    else{
        res.redirect('/login')
    }
}

//Check Current User
const checkUser =  (req, res, next) => {
    //verify the token as we dit with requireAuth
    
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'mohamed the ghost', async (err, decodedToken) => {
            if(err){ 
                console.log(err.message)
                res.locals.user = null; //important
                next();
            }
            else{
                //get user information so we can inject it in the views in the future
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id); //async on the callback
                //using res.locals (global variables)
                res.locals.user = user; //we can use this property user to output his email in the header
                next();
            }
        });      
    }
    else{
        res.locals.user = null; //important
        next();
    }
}

module.exports = { requireAuth, checkUser };