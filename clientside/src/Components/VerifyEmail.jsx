import React, { useState } from "react";
import axios from "axios";
import "./scss/VerifyEmail.scss";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3002/api/verifyEmail", { email });

      if (res.status === 200) {
        setMessage("Verification email sent! Please check your inbox.");
      }
    } catch (error) {
      setMessage("Error: Email does not exist.");
    }
  };

  return (
    <div className="email-verify-container">
      <h2>Email Verification</h2>
      <form onSubmit={handleVerifyEmail}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn">Send Verification Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyEmail;
