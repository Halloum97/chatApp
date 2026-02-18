import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import './ProfileUpdate.css'
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import upload from "../../lib/upload";
import { auth, db } from "../../config/firebase";

const ProfileUpdate =()=>{

  const navigate = useNavigate();
  const { userData, setUserData } = useContext(AppContext);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(userData){
      setName(userData.name || "");
      setBio(userData.bio || "");
    }
  }, [userData]);

  const onSubmitHandler = async (event)=>{
    event.preventDefault();

    if(!auth.currentUser){
      toast.error("You need to log in first.");
      return;
    }

    const trimmedName = name.trim();
    const trimmedBio = bio.trim();

    if(!trimmedName || !trimmedBio){
      toast.error("Please fill in name and bio.");
      return;
    }

    setLoading(true);
    try {
      let avatar = userData?.avatar || "";

      if(image){
        const uploadedAvatar = await upload(image, `avatars/${auth.currentUser.uid}`);
        if(!uploadedAvatar){
          throw new Error("Failed to upload profile image.");
        }
        avatar = uploadedAvatar;
      }

      const updateObject = {
        name: trimmedName,
        bio: trimmedBio,
        avatar,
      };

      await updateDoc(doc(db, 'users', auth.currentUser.uid), updateObject);

      setUserData((prev)=>({
        ...(prev || { id: auth.currentUser.uid }),
        ...updateObject,
      }));

      toast.success("Profile updated!");
      navigate('/chat');
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  const avatarPreview = image ? URL.createObjectURL(image) : (userData?.avatar || assets.avatar_icon);

  return(
    <div className="profile">
        <div className="profile-container">
          <form onSubmit={onSubmitHandler}>
            <h3>Profile details</h3>
            <label htmlFor="avatar">
              <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden disabled={loading}/>
              <img src={avatarPreview} alt="" />
              upload profile image
            </label>
            <input type="text" placeholder="Your name" required value={name} onChange={(e)=>setName(e.target.value)} disabled={loading}/>
            <textarea placeholder="Write profile bio" required value={bio} onChange={(e)=>setBio(e.target.value)} disabled={loading}></textarea>
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </form>
          <img className="profile-pic" src={avatarPreview} alt="" />
        </div>
    </div>
  )
}
export default ProfileUpdate