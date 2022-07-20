const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

userSchema.pre("save", async function() {
  const user = this
  
  try {
    if (this.isModified("password") || this.isNew){
      const salt = await bcrypt.genSalt(10)
      
      const hash = await bcrypt.hash(user.password, salt)
      
      user.password = hash
    }
  } catch (error) {
    console.log(error)
  }
})

userSchema.statics.createUser = async function(email, name, password){
  // Search the database for a user with the name submitted in the form

  try{
    
      const newUser = await new this({
        name,
        password,
        email
        });
        newUser.save()
        return newUser
    
   
  }catch(Error){
     console.log(Error)     
  }
} 

userSchema.statics.loginUser = async function(findUserLog, password){
  
  try{
      const isSamePassword = await bcrypt.compare(password, findUserLog.password)
      
      if (isSamePassword) {
        return findUserLog
      }
      
  }catch(Error){
     console.log(Error)    
  }
}
module.exports = model("User", userSchema);
