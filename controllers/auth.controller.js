const User = require('../models/User.model');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const {transporter} = require('../config/mail');
const { json } = require('express');



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

        
        // Genero el token de verificación 
        const verificationToken = jwt.sign(
            { ID: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" }
        )
        
        // Envio el email de confirmación a la cuenta
        const url = `http://localhost:3000/verify?token=${verificationToken}`
        
        
        await transporter.sendMail({
            from: "timeswapteam1@gmail.com",
            to:  email,
            subject: 'Verifica tu cuenta',
            html: `
            <b>Porfavor, presiona <a href ='${url}'>aquí</a> para completar el proceso de verificación.</b>`
        })
      
       return res.status(200).json(user)


    } catch (error){
        console.log(error)
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


async function verify(req, res){
    
    const { token } = req.params
    console.log("Entra en verify")
    // Checkeo que los parametros del request contengan el token 
    if (!token) {
        return res.status(422).send({ 
            message: "Falta token" 
        });
    }
    // Verifico el token del request con el que tengo en mi archivo .env
    let payload = null

    try {
        payload = jwt.verify(
           token,
           process.env.TOKEN_SECRET
        );
    } catch (err) {
        return res.status(500).send(err);
    }
    try{

        //Compruebo la existencia del usuario con el id que contenga el token
        const user = await User.findOne({ _id: payload.ID }).exec();
        if (!user) {
            console.log('No existe el usuario')
            return res.status(404).send({ 
              message: "El usuario no existe" 
            });
        }
        
        // Cambio el campo de verificado a true
        user.verified = true;
        await user.save();
        
        return res.status(200).send({
            message: "El usuario ha sido verificado"
        });
    } catch (err) {
        return res.status(500).send(err);
    }
     
}

async function verifyPass(req, res){

    const { token } = req.params
    
    // Checkeo que los parametros del request contengan el token 
    if (!token) {
        return res.status(422).json({ message: "Falta token"});
    }
    // Verifico el token del request con el que tengo en mi archivo .env
    let payload = null

    try {
        payload = jwt.verify(
           token,
           process.env.TOKEN_SECRET
        );

        const user = await User.findOne({ _id: payload.ID }).exec();

        if(user) return res.json(user)

    } catch (err) {
        return res.json({message: err})
    }
    
}

async function autLogin(req, res){
   
    const { email,password } = req.body;
  
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
        const userVerified = findUserLog.checVerify()
        
        if(!userVerified){
            return res.status(400).json({message: `Check ${email} to verify your account`})
        } 

        const userLoged = userVerified.checkPass(password)
    
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

async function forgot(req, res, next){
    
    const {email} = req.body
   
    try {
        const user = await User.findOne({ email })
        
        if(!user) res.json({message: "No user with this email"})
        
        else{

         // Genero el token de verificación 
         const verificationToken = jwt.sign(
            { ID: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" }
        )

        // Envio el email de confirmación a la cuenta
        const url = `http://localhost:3000/verifyTokenPass?token=${verificationToken}`
        
        
        await transporter.sendMail({
            from: "timecitizen@gmail.com",
            to:  email,
            subject: 'change your password',
            html: `
            <b>Porfavor, presiona <a href ='${url}'>aquí</a> modificar tu contraseña.</b>`
        })
      
       return res.status(200).json(user)}

    } catch (err) {
        console.log(err)
        next(err)
    }
}

async function passwordModify(req, res){
  
    const {userEmail} = req.body
    const {password,} = req.body.values
    
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        
        const filter = { email: userEmail };
        const update = { password: hash };

        const user = await User.findOneAndUpdate(filter, update, { new: true })
        console.log(user)
        return res.json(user)
    }
    catch(err){
        next(err)
    }
}

module.exports = {
    authSignUp,
    autLogin,
    verify,
    verifyPass, 
    forgot,
    passwordModify
    
}