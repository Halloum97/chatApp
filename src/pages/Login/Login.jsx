import React, { useState } from "react";
import './Login.css'
import assets from "../../assets/assets";
import { signup, login } from "../../config/firebase";

const Login =()=>{
    const [currState, setCurrentState] = useState("Sign up");
    const[userName, setUserName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    const onSubmitHandler = (event)=>{
        event.preventDefault();
        if(currState=="Sign up"){
            signup(userName, email, password);
        }
        else{
            login(email, password);
        }
    }

  return(
    <div>
        <div className="login">
            <img src={assets.logo_big} alt="" className="logo"/>
            <form onSubmit={onSubmitHandler} className="login-form">
                <h2>{currState}</h2>
                {currState=="Sign up"?<input onChange={(e)=>setUserName(e.target.value)} value={userName} type="text" placeholder="username" required className="form-input" />:null}
                <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Email Address" required className="form-input" />
                <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="password" required className="form-input" />
                <button type="submit">{currState=="Sign up"?"Create account":"Login now"}</button>
                
                    {
                        currState=="Sign up"
                        ?<div className="login-term"><input type="checkbox" /><p>Agree to the terms of use & privacy policy.</p></div>
                        :null
                    }
                
                <div className="login-forgot">
                    {
                        currState=="Sign up"
                        ?<p className="login-toggle">Already have an account <span onClick={()=>setCurrentState("Login")}>login here</span></p>
                        :<p className="login-toggle">Create an account <span onClick={()=>setCurrentState("Sign up")}>click here</span></p>

                    }

                </div>
            </form>
        </div>
    </div>
  )
}
export default Login
