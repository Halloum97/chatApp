import { useContext, useState } from 'react';
import assets from '../../assets/assets';
import './LeftSidebar.css'
import { AppContext } from '../../context/AppContext';
import { db, logout } from '../../config/firebase';
import { collection, doc, getDocs, query, setDoc, updateDoc, where, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LeftSidebar =()=>{
  const navigate = useNavigate();
  const { userData, chatData, messagesId, setMessagesId, setChatUser } = useContext(AppContext);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = async (e)=>{
    e.preventDefault();
    const input = searchInput.trim().toLowerCase();
    if(!input){
      setSearchResult(null);
      setShowSearch(false);
      return;
    }
    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('username', '==', input));
      const querySnap = await getDocs(q);
      if(!querySnap.empty){
        const results = [];
        querySnap.forEach((docSnap)=>{
          const data = docSnap.data();
          if(data.id !== userData.id){
            results.push(data);
          }
        });
        setSearchResult(results.length > 0 ? results : null);
      } else {
        setSearchResult(null);
      }
      setShowSearch(true);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const addChat = async (user) => {
    try {
      // Check if chat already exists
      if(chatData){
        const existingChat = chatData.find(chat => chat.rId === user.id);
        if(existingChat){
          setMessagesId(existingChat.messageId);
          setChatUser({...user, messageId: existingChat.messageId});
          setShowSearch(false);
          setSearchInput("");
          setSearchResult(null);
          return;
        }
      }

      // Create new messages document
      const messagesRef = doc(collection(db, 'messages'));
      await setDoc(messagesRef, { messages: [] });

      const newMessageId = messagesRef.id;

      // Update both users' chat lists
      await updateDoc(doc(db, 'chats', userData.id), {
        chatData: arrayUnion({
          messageId: newMessageId,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });
      await updateDoc(doc(db, 'chats', user.id), {
        chatData: arrayUnion({
          messageId: newMessageId,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });

      setMessagesId(newMessageId);
      setChatUser({...user, messageId: newMessageId});
      setShowSearch(false);
      setSearchInput("");
      setSearchResult(null);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const selectChat = async (chat) => {
    setMessagesId(chat.messageId);
    setChatUser({...chat.userData, messageId: chat.messageId});

    // Mark messages as seen
    try {
      const chatRef = doc(db, 'chats', userData.id);
      const updatedChatData = chatData.map(c => {
        if(c.messageId === chat.messageId){
          return {...c, messageSeen: true};
        }
        return c;
      });
      // Rebuild without userData field (only store raw chat entries)
      const rawChatData = updatedChatData.map(({userData: _u, ...rest}) => rest);
      await updateDoc(chatRef, { chatData: rawChatData });
    } catch (error) {
      console.error("Failed to update seen status:", error);
    }
  }

  const clearSearch = () => {
    setSearchInput("");
    setSearchResult(null);
    setShowSearch(false);
  }

  return(
    <div className='ls'>
        <div className="ls-top">
            <div className="ls-nav">
                <img src={assets.logo} className='logo' />
                <div className="menu">
                    <img src={assets.menu_icon} />
                    <div className="sub-menu">
                        <p onClick={()=>navigate('/profile')}>Edit Profile</p>
                        <hr />
                        <p onClick={()=>logout()}>Logout</p>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSearch} className="ls-search">
                <img src={assets.search_icon} />
                <input
                  type="text"
                  placeholder='Search here..'
                  value={searchInput}
                  onChange={(e)=>{
                    setSearchInput(e.target.value);
                    if(!e.target.value){
                      clearSearch();
                    }
                  }}
                />
            </form>
        </div>
        <div className="ls-list">
            {showSearch && searchResult ? (
              searchResult.map((user)=>(
                <div key={user.id} className="friends" onClick={()=>addChat(user)}>
                  <img src={user.avatar || assets.avatar_icon} />
                  <div>
                    <p>{user.name || user.username}</p>
                    <span>@{user.username}</span>
                  </div>
                </div>
              ))
            ) : showSearch && !searchResult ? (
              <div className="ls-empty">
                <p>No user found</p>
              </div>
            ) : chatData && chatData.length > 0 ? (
              chatData.map((chat)=>(
                <div
                  key={chat.messageId}
                  className={`friends ${messagesId === chat.messageId ? 'active' : ''}`}
                  onClick={()=>selectChat(chat)}
                >
                  <img src={chat.userData?.avatar || assets.avatar_icon} />
                  <div>
                    <p>{chat.userData?.name || chat.userData?.username || 'Unknown'}</p>
                    <span className={!chat.messageSeen ? 'unseen' : ''}>
                      {chat.lastMessage
                        ? (chat.lastMessage.length > 30 ? chat.lastMessage.slice(0,30) + '...' : chat.lastMessage)
                        : 'No messages yet'}
                    </span>
                  </div>
                  {!chat.messageSeen && <span className="unseen-dot"></span>}
                </div>
              ))
            ) : chatData && chatData.length === 0 ? (
              <div className="ls-empty">
                <p>No conversations yet</p>
                <span>Search for a user to start chatting</span>
              </div>
            ) : null}
        </div>
    </div>
  )
}
export default LeftSidebar