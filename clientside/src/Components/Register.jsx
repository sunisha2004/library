import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./scss/Register.scss";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: localStorage.getItem("email"),
    phone: "",
    accType: "",
    pwd: "",
    cpwd: "",
  });
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.pwd ||
      !formData.cpwd
    ) {
      alert("All fields are required");
      return;
    }

    if (formData.pwd !== formData.cpwd) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/api/adduser",
        formData
      );
      setSuccess(response.data.msg);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="input-group">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Account Type:</label>
            <select
              name="accType"
              value={formData.accType}
              onChange={handleChange}
              required
            >
              <option value="">Select an account type</option>
              <option value="publisher">Publisher</option>
              <option value="reader">Reader</option>
            </select>
          </div>

          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              name="pwd"
              value={formData.pwd}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="cpwd"
              value={formData.cpwd}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
