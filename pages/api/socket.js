import { Server } from "socket.io";


const users =[];
const joinRoom = (id,room,usr)=>{

    const user = {id,room,usr};
    users.push(user);
    return user;
}

const getUser = (room)=>{
    return users.filter((usr)=>usr.room===room);
}

export default async function SocketHandler(req,res){
    if(req.socket.server.io){
        console.log("Socket is already running");
    }else{

        const io = new Server(req.socket.server);
        req.socket.server.io = io;

        io.on("connection",(socket)=>{
            console.log(socket.id);

            socket.on("join",(data)=>{
                console.log(data);
                const user = joinRoom(socket.id,data.room,data.user);
                socket.join(user.room);

                io.to(user.room).to("RoomUsers",{
                    users:getUser(user.room),
                    room:user.room,
                })

            })
            socket.on("message",(data)=>{
                console.log(data);
                socket.to(data.room).emit("received",data);
            })
        })
    }

    res.end();

}