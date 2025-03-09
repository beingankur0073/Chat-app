import React, { Fragment,lazy,useCallback,useEffect,useRef, useState } from 'react'
import Applayout from '../components/layout/Applayout.jsx'
import { IconButton, Skeleton, Stack } from '@mui/material';
import { grayColor,orange } from '../constants/color.js';
import { AttachFile as AttachFileIcon,Send as SendIcon } from '@mui/icons-material';
import {InputBox} from '../components/styles/StyledComponents.jsx'
import {FileMenu} from '../components/dialogs/FileMenu.jsx'
import { sampleMessages } from '../constants/sampleData.js';
import MessageComponent from '../components/shared/MessageComponent.jsx';
import { getSocket } from '../socket.jsx';
import { NEW_MESSAGE } from '../constants/events.js';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api.js';
import { useErrors, useSocketEvents } from '../hooks/hook.jsx';


const user={
  _id:"sdfsdfsdf",
  name:"Abhishek Nahar Singh",
}


const Chat = ({chatId,user}) => {


  const containerRef=useRef(null);

  const socket=getSocket()

  const [message,setMessage]=useState("")
  const [messages,setMessages]=useState([])
  const [page,setPage]=useState(1)

  const chatDetails=useChatDetailsQuery({chatId,skip:!chatId})

  const oldMessagesChunk=useGetMessagesQuery({chatId,page})

  const errors=[
  {
    isError:chatDetails.isError,
    error:chatDetails.error
  },
  {
    isError:oldMessagesChunk.isError,
    error:oldMessagesChunk.error
  }
]

  console.log("oldMessageChunk",oldMessagesChunk.data)

  const members=chatDetails?.data?.chat?.members

  const submitHandler=(e)=>{
    e.preventDefault()
    if(!message.trim()) return;


    // Emiting Message to the server
    socket.emit(NEW_MESSAGE,{chatId,members,message})
    setMessage("")
  }


  const newMessagesHandler=useCallback((data)=>{
    setMessages((prev)=>[...prev,data.message])
  },[])

  

  const eventHandler={[NEW_MESSAGE]:newMessagesHandler}
  
  useSocketEvents(socket,eventHandler)
  useErrors(errors)

  

  return chatDetails.isLoading ? (<Skeleton/> ):
  (
    <Fragment>
    <Stack
    ref={containerRef}
    boxSizing={"border-box"}
    padding={"1rem"}
    spacing={"1rem"}
    bgcolor={grayColor}
    height={"90%"}
    sx={{
      overflowX:"hidden",
      overflowY:"auto",
    }}
    >
      { !oldMessagesChunk.isLoading &&
        oldMessagesChunk.data?.messages?.map((i)=>(
          <MessageComponent key={i._id} message={i} user={user}/>
        ))
      }

      {
        messages.map((i)=>(
          <MessageComponent key={i._id} message={i} user={user}/>
        ))
      }

    </Stack>

    <form
    style={{
      height:"10%"
    }} 
    onSubmit={submitHandler}
    >
      <Stack 
      direction={"row"} 
      height={"100%"}
      padding={"1rem"}
      alignItems={"center"}
      position={"relative"}
      >

        <IconButton
         sx={{
           position:"absolute",
           left:"1.5rem",
           rotate:"30deg",
         }}
         
        >
          <AttachFileIcon/>
        </IconButton>


        <InputBox placeholder='Type Messages Here...' 
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        />

        <IconButton 
        type='submit'
        sx={{
          rotate:"-30deg",
          bgcolor:orange,
          color:"white",
          marginLeft:"1rem",
          padding:"0.5rem",
          "&:hover":{
            bgcolor:"error.dark"
          }
        }}
        >
          <SendIcon/>
        </IconButton>

      </Stack>
    </form>

    <FileMenu />

    </Fragment>
  )
}

export default Applayout()(Chat);