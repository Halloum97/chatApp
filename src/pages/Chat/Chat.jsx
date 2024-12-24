import ChatBox from '../../components/ChatBox/ChatBox';
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar';
import RightSidebar from '../../components/RightSidebar/RightSidebar';
import './Chat.css'
import React from "react";

const Chat =()=>{
  return(
    <div className='chat'>
      <div className="chat-container">
        <LeftSidebar/>
        <ChatBox/>
        <RightSidebar/>
      </div>
    </div>
  )
}
export default Chat