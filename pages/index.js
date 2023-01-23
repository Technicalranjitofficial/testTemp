import React, { useEffect, useState } from 'react'

import { io } from 'socket.io-client'
const socket = io();

const Index = () => {

    const [message,setMes]= useState('');
    const [cont,setCon]= useState('');

    useEffect(()=>{
        socket.on("connect",()=>{
            console.log("Connected",socket.id);
            socket.on("success",(msg)=>{
                console.log(msg);

                   socket.on("rec",(data)=>{
                setCon(data);
                console.log(data)
            })

            })

            socket.on("rec",(data)=>{
                setCon(data);
                console.log(data)
            })
         
        })
    },[])

    const sendmes = ()=>{
        socket.emit("send",message)
    }
  return (
    <div>
        {cont && cont}
        <input type="text" value={message} onChange={(e)=>setMes(e.target.value)} />
        <button onClick={sendmes}>Submit</button>
      
    </div>
  )
}

export default Index
