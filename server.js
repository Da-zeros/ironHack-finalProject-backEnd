const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 5005;

const myServer = app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

const { Server } = require('socket.io')
const socketioJwd = require('socketio-jwt')
const Message = require('./models/Message.model')

const io = new Server(myServer, {
  cors: {
    origen: process.env.ORIGIN || "http://localhost:3000"
  }
})

io.use(socketioJwd.authorize({
  secret: process.env.TOKEN_SECRET,
  handshake: true
}))

io.on("connection", (socket) =>{
  const user = socket.decoded_token
  console.log(`usuario conectado ${user.name}`)

  socket.on('join_chat',(chatId)=>{
    socket.join(chatId)
    console.log(`User ${user.name} entrando en sala ${chatId}`)
  })

  socket.on('send_message', async (messageObj) =>{
    const fullMessage = {...messageObj, sender: user}
    await Message.create(fullMessage)
    socket.to(fullMessage.chatId).emit('receive_message', fullMessage)

    socket.emit('receive_message', fullMessage)
  })
 
})

