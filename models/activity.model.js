const { Schema,  model  } = require("mongoose");

let ActivitySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title:String,
    location:String,
    description: String,
    type: String,
    date: Date,
    time: Number,
    notes: String,
    file: String,
    },
    {timestamps:true}
)


let Activity = model("Activity", ActivitySchema)


module.exports = Activity