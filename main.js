const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {formatMessage} = require('./utils/formatMessage');
const {userJoin , getCurrentUser, userLeaves, getRoomUsers} = require('./utils/users')

const app =express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname,'public')))

// run when a client connects
const botName = 'iChat Bot'

io.on('connection',socket=>{
     socket.on('joinRoom',({username, room})=>{
          const user = userJoin(socket.id,username,room);
          socket.join(user.room)
          
          // Welcome message current user
          socket.emit('message',formatMessage(botName,`Welcome to ${user.room}`))
     
          //Broadcast when a new user connects
          socket.broadcast
          .to(user.room)
          .emit('message',formatMessage(botName,`${user.username} has joined the chat`));

          // Send room and users info
          io.to(user.room).emit('roomUsers',{
               room: user.room,
               users: getRoomUsers(room)
          })
     })


     // Listen for chat message
     socket.on('chatMessage', (msg)=>{
          const user = getCurrentUser(socket.id)
          io.to(user.room).emit('message',formatMessage(user.username,msg));
     })

     // Broadcast when a user disconnects
     socket.on('disconnect', ()=>{
          const user =   userLeaves(socket.id);

          if(user){
               io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
                
               // Send room and users info
               io.to(user.room).emit('roomUsers',{
                    room: user.room,
                    users: getRoomUsers(user.room)
               })
          }
     });
})

const port = 3000 || process.env.PORT
server.listen(port, ()=>{
     console.log(`Server is running on port ${port}`)
})