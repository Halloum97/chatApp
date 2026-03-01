import { useContext, useEffect, useRef, useState } from 'react';
import assets from '../../assets/assets';
import './ChatBox.css'
import { AppContext } from '../../context/AppContext';
import { arrayUnion, doc, onSnapshot, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';

const ChatBox =()=>{
  const { messagesId, chatUser, userData } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollEnd = useRef(null);

  // Subscribe to messages in real-time
  useEffect(()=>{
    if(messagesId){
      const unsub = onSnapshot(doc(db, 'messages', messagesId), (snapshot)=>{
        const data = snapshot.data();
        if(data && data.messages){
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      });
      return ()=>{
        unsub();
      }
    }
  },[messagesId])

  // Auto-scroll to latest message
  useEffect(()=>{
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth' });
  },[messages])

  const sendMessage = async ()=>{
    const text = input.trim();
    if(!text || !messagesId) return;

    setInput("");
    try {
      await updateDoc(doc(db, 'messages', messagesId), {
        messages: arrayUnion({
          sId: userData.id,
          text,
          createdAt: Timestamp.now()
        })
      });

      // Update current user's chat metadata
      const myChatRef = doc(db, 'chats', userData.id);
      const myChatSnap = await getDoc(myChatRef);
      const myData = myChatSnap.data();
      if(myData && myData.chatData){
        const updatedMyChat = myData.chatData.map(chat => {
          if(chat.messageId === messagesId){
            return {...chat, lastMessage: text.slice(0, 30), updatedAt: Date.now(), messageSeen: true};
          }
          return chat;
        });
        await updateDoc(myChatRef, { chatData: updatedMyChat });
      }

      // Update other user's chat metadata
      const otherChatRef = doc(db, 'chats', chatUser.id);
      const otherChatSnap = await getDoc(otherChatRef);
      const otherData = otherChatSnap.data();
      if(otherData && otherData.chatData){
        const updatedOtherChat = otherData.chatData.map(chat => {
          if(chat.messageId === messagesId){
            return {...chat, lastMessage: text.slice(0, 30), updatedAt: Date.now(), messageSeen: false};
          }
          return chat;
        });
        await updateDoc(otherChatRef, { chatData: updatedOtherChat });
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const formatTime = (timestamp)=>{
    if(!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  }

  if(!chatUser){
    return(
      <div className='chat-box chat-welcome'>
        <img src={assets.logo_icon} alt="" />
        <p>Select a chat to start messaging</p>
      </div>
    )
  }

  return(
    <div className='chat-box'>
        <div className="chat-user">
            <img src={chatUser.avatar || assets.avatar_icon} alt="" />
            <p>{chatUser.name || chatUser.username} {chatUser.lastSeen && Date.now() - chatUser.lastSeen < 70000 && <img className='dot' src={assets.green_dot} alt="" />}</p>
            <img src={assets.help_icon} className='help' alt="" />
        </div>

        <div className="chat-msg">
          {messages.map((msg, index)=>(
            <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
              {msg.image
                ? <img className='msg-img' src={msg.image} alt="" />
                : <p className="msg">{msg.text}</p>
              }
              <div>
                <img src={msg.sId === userData.id ? (userData.avatar || assets.avatar_icon) : (chatUser.avatar || assets.avatar_icon)} alt="" />
                <p>{formatTime(msg.createdAt)}</p>
              </div>
            </div>
          ))}
          <div ref={scrollEnd}></div>
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder='Send a message'
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=>{ if(e.key === 'Enter') sendMessage() }}
          />
          <input type="file" id='image' accept='image/png, image/jpeg' hidden/>
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" />
          </label>
          <img onClick={sendMessage} src={assets.send_button} alt="" className='send-btn' />
        </div>

    </div>
  )
}
export default ChatBox