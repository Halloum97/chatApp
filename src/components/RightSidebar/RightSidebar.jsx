import { useContext } from 'react';
import assets from '../../assets/assets';
import { logout } from '../../config/firebase';
import './RightSidebar.css'
import { AppContext } from '../../context/AppContext';

const RightSidebar =()=>{
  const { chatUser } = useContext(AppContext);

  if(!chatUser){
    return(
      <div className='rs'>
        <button onClick={()=>logout()}>Logout</button>
      </div>
    )
  }

  return(
    <div className='rs'>
        <div className="rs-profile">
          <img src={chatUser.avatar || assets.avatar_icon} alt="" />
          <h3>
            {chatUser.name || chatUser.username}
            {chatUser.lastSeen && Date.now() - chatUser.lastSeen < 70000 && <img src={assets.green_dot} className='dot' alt="" />}
          </h3>
          <p>{chatUser.bio || ''}</p>
        </div>
        <hr />
        <div className="rs-media">
          <p>Media</p>
          <div>
            <p className="rs-empty-media">No shared media yet</p>
          </div>
        </div>
        <button onClick={()=>logout()}>Logout</button>
    </div>
  )
}
export default RightSidebar