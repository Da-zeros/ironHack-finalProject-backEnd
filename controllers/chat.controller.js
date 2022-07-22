
const { findOne } = require('../models/Chat.model')
const Chat = require('../models/Chat.model')
const Message = require('../models/Message.model')


async function chatSart(req, res, next){
   
    const { _id } = req.payload // User 1
    const { userId } = req.params // User 2

    try {
        
        const foundChat = await Chat.findOne({ participants: { $all:[_id, userId] }})

        if(foundChat){
            res.json(foundChat)
        }else{
            const newChat = await Chat.create({participants: [_id, userId]})
            res.json(newChat)
        }

    } catch (err) {
        next(err)
    }
}

async function showChatConv(req, res, next){
    
    const { chatId } = req.params
    
    try {

        const response = await Message.find({ chatId })
        res.json(response)

    } catch (err) {
        next(err)
    }
    
    console.log(req.params)
}

module.exports = {
    chatSart,
    showChatConv
}