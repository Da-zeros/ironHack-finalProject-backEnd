const { Schema,  model  } = require("mongoose");

let ChatSchema = new Schema({
    participants :[
        {
            ref:"User",
            type: Schema.Types.ObjectId
        }
    ]
    },
    {timestamps:true}
)


let Chat = model("Chat", ChatSchema)


module.exports = Chat