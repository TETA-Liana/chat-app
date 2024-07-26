const express=require('express');
const app=express();
const http=require('http');
const cors=require('cors');
const {Server}=require("socket.io");
const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});
const messageSchema=new mongoose.Schema({
    name:String,
    id:String,
    message:String,
});
const Message=mongoose.model('Message',messageSchema);
app.use(cors());
const server=http.createServer(app);
const io=new Server(server,{
   cors:{
       origin:"http://localhost:3000",
        methods:["GET","POST"],
    },
});

io.on("connection",(socket)=>{
    console.log(`User connected :${socket.id}`);
    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`User with ID${socket.id} joined room :${data}`);
    });
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
      });

    socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id);
    });
});


server.listen(3002,()=>{
    console.log("SERVER RUNNING");
})