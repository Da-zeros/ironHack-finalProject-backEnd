const { Schema,  model  } = require("mongoose");

let ActivitySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title:String,
    location:String,
    description: String,
    type: String,
    data: Date,
    time: Number,
    notes: String,
    file: String,
    },
    {timestamps:true}
)

module.exports = model("Activity", ActivitySchema)