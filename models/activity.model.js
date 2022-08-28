const { Schema,  model  } = require("mongoose");
const mongoose = require('mongoose') 

let ActivitySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title:String,
    location:String,
    description: String,
    type: String,
    data: Date,
    time: Number,
    notes: String,
    file: String,
    comment:[String],
    },
    {timestamps:true}
)


const Activity = mongoose.model("Activity", ActivitySchema)
module.exports = Activity 