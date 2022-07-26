const mongoose = require("mongoose");
const { Schema, model } = mongoose;


let activityTypeSchema = new Schema(
    {
    type :[String]
    },
    {timestamps:true}
)


module.exports = model("Activitytype", activityTypeSchema)