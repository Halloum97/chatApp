import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children })=>{

    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const intervalRef = useRef(null);

    const loadUserData = useCallback(async(uid)=>{
        try {
            const userRef = doc(db, 'users', uid)
            const userSnap = await getDoc(userRef)
            const userData = userSnap.data();
            setUserData(userData);
            if(userData.avatar && userData.name){
                navigate('/chat')
            }
            else{
                navigate('/profile')
            }
            await updateDoc(userRef,{
                lastSeen:Date.now()
            })
        } catch (error) {
            toast.error(error.message);
        }
    }, [navigate])

    // Heartbeat: update lastSeen every 60 seconds while logged in
    useEffect(()=>{
        if(userData){
            const userRef = doc(db, 'users', userData.id);
            intervalRef.current = setInterval(async()=>{
                if(auth.currentUser){
                    try {
                        await updateDoc(userRef,{
                            lastSeen:Date.now()
                        })
                    } catch (error) {
                        console.error("Failed to update lastSeen:", error);
                    }
                }
            }, 60000);
        }
        return ()=>{
            if(intervalRef.current){
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    },[userData])

    const value = {
        userData, setUserData,
        chatData, setChatData,
        loadUserData
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppContextProvider;