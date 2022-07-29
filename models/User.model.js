const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  verified:{type:Boolean, default:false},
  activities:[
    { type: Schema.Types.ObjectId, 
      ref: 'Activity'
    }
    ]
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

userSchema.methods.checkPass = function(password){
  
  try{
      const isSamePassword = bcrypt.compare(password, this.password)
      
      if (isSamePassword) {
        return this
      }
      
  }catch(Error){
     console.log(Error)    
  }
}

userSchema.methods.checVerify = function(){
  
  try{
      const userVerified = this.verified
      if (userVerified) return this
      
  }catch(Error){
     console.log(Error)    
  }
}
module.exports = model("User", userSchema);
