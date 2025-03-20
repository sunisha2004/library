import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './scss/ResetPassword.scss'

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (pass !== cpass) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.put("http://localhost:3002/api/updatePassword", {
        email,
        pass,
        cpass,
      });

      if (res.status === 201) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <label>New Password:</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />

        <label>Confirm Password:</label>
        <input
          type="password"
          value={cpass}
          onChange={(e) => setCpass(e.target.value)}
          required
        />

        <button type="submit" className="btn">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
