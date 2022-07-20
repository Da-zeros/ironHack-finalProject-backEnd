const User = require('../models/User.model');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


async function  authSignUp(req, res){
    
    const {email,name,password} = req.body;
    
    if(validator.isEmpty(name) || validator.isEmpty(password) || validator.isEmpty(email)){
        return res
            .status(400)
            .json({ message: 'All fields are mandatory. Please provide your name and password' });
        }
    if (!validator.isStrongPassword(password)) {
        return res
          .status(400)
          .json({ message: 'Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter and especial caracter.' });
    }

    if (!validator.isEmail(email)) {
        return res
          .status(400)
          .json({ message: 'Please entry a valid email' });
    }

    try {

        const findUserSign = await User.findOne({ email })
        
        if(findUserSign){
            
            return res.status(400).json({message: "User with this email already exists"})
        }
        const user = await User.createUser(email, name, password)
        
        if (user) return res.status(200).json({message: 'User created'})
        else{
            return res.status(400).json({ message: 'User already exists.' });

        }
    } catch (error){
        
        if (error instanceof mongoose.Error.ValidationError) {
            return res
                .status(400)
                .json({ errorMessage: error.message });
            }
            return res
            .status(500)
            .json({ errorMessage: error.message })
    }
}

async function autLogin(req, res){
    console.log("Entra en login")
    const { email,password } = req.body;
    console.log(email, password)
    
    if(validator.isEmpty(email) || validator.isEmpty(password)){
        return res
            .status(400)
            .json({ message: 'All fields are mandatory. Please provide your name and password.'})
    }

    try {

        const findUserLog = await User.findOne({ email })
        
        if(!findUserLog){
            
            return res.status(400).json({message: "No user with this email"})
        }
        
        const userLoged = await User.loginUser(findUserLog, password)
        console.log(userLoged)
       
        if (!userLoged) return res.status(400).json({message: "Wrong credentials."})
        
        else{    
            const { _id, email, name } = userLoged;
            const payload = { _id, email, name };
            const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '6h' });
            res.status(200).json({ authToken: authToken });} 
        
    } catch (err) {
        console.log(err);
       
    }  
}

module.exports = {
    authSignUp,
    autLogin
    
}