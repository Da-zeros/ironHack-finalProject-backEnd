const moongose = require ('mongoose')
const { schema } = require('./User.model')
const Schema = moongose.Schema

const tokenSchema = new schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'user',
        unique:true
    },
    token:{type:String, required:true},
    createdAt:{type, Date, default:Date.now(), expires:3600}
})

module.export = moongose.model('token', tokenSchema)