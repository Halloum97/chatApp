
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyABm8PMj_7xxx70Kl_X8Jg8qpP_b4PEU8w",
  authDomain: "chat-app-gs-302a3.firebaseapp.com",
  projectId: "chat-app-gs-302a3",
  storageBucket: "chat-app-gs-302a3.appspot.com",
  messagingSenderId: "486808012900",
  appId: "1:486808012900:web:9ddd1cf8c1886dfacdb771"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async(username, email, password)=>{
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name: "",
            avatar:"",
            bio:"Hey, There I am using chat app",
            lastSeen: Date.now()
        })
        await setDoc(doc(db, "chats", user.uid),{
            chatData:[]
        })
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async(email, password)=>{
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async()=>{
    
    try {
        await signOut(auth);
    } catch (error) {
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

export {signup, login, logout, auth, db}
