import React, { useState } from "react";
import "./scss/EmailVerify.scss";

import axios from "axios";

function EmailVerify() {
  const [email, setEmail] = useState("");

  const handleChange = (e)=>{
    setEmail(e.target.value)
  }
  const handleSubmit = async (e)=>{

    e.preventDefault()
    try{
        console.log(email);
        const res = await axios.post('http://localhost:3002/api/verifyRegister',{email})
        console.log(res);
        if(res.status == 200) {
            alert(res.data.msg)
            localStorage.setItem('email',email)
        }else{
            alert(res.msg);
            alert(res.data.msg)
        }
        
    }catch(error){
        console.log(error);
        
    }
  }

  return (
    <>

        <div className="verify-container">
            <h1>Email Verification</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" name="email" value={email} onChange={handleChange} placeholder="Enter your Email" required />

                </div>
                <button type="submit" className="btn-verify">Verify</button>
            </form>
        </div>
    </>
  )
 
}

export default EmailVerify;
