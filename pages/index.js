import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'

// const inter = Inter({ subsets: ['latin'] })
import io from "socket.io-client";

let socket;

export default function Home() {
  const [message,setMessage] = useState("");
  const [room,setRoom] = useState('');
  const [mes,setMes] = useState([]);
  const [user,setUser] = useState('');
  const [next,setNext] = useState(false);



  useEffect(()=>{
    initializeSocket();
  },[])

  const initializeSocket=async()=>{

    await fetch('/api/socket');
    socket = io();
    socket.on("connect",()=>{

      console.log("Socket Connected Sucessfully",socket.id);
    })

   

    socket.on("received",(data)=>{
      console.log(data);
      setMes(message=>message.concat(data));
      if(mes){
        console.log(mes)
      }
    })

    socket.on("RoomUsers",(data)=>{
      console.log(data);
    })
    


  }

  const sendMessage=()=>{
    const data={user:user,message:message,room:room}
    setMes(message=>message.concat(data))
    socket.emit("message",data
    );
    setMessage("");
  }

  const joinRoom=()=>{
    const data={
      user:user,
      room:room
    }
    socket.emit("join",data);
    setNext(true);
  }
  return (
    <>
     {!next? <div>
        <input type="text" placeholder='ROOM' value={room} onChange={(e)=>setRoom(e.target.value)} />
        <input type="text" placeholder='User' value={user} onChange={(e)=>setUser(e.target.value)} />
        <button onClick={joinRoom}>Join</button>
      </div>: <div>

        {mes && mes.map((val,index)=>{
          return user===val.user?<h1 key={index}>{val.user}:{val.message}</h1>:<h3 key={index}>{val.user}:{val.message}</h3>
        })}

        <input type="text" placeholder='Message' value={message} onChange={(e)=>setMessage(e.target.value)} />
        {/* <input type="text" placeholder='User' value={user} onChange={(e)=>setUser(e.target.value)} /> */}
        <button onClick={sendMessage}>Message</button>
      </div>}
    </>
  )
}
