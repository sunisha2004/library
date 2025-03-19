import React, { useEffect, useState } from "react";
import "./scss/Profile.scss";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", phone:"" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Profile API Response:", res.data);
        if (res.status === 200) {
          setUser(res.data.usr);
          setFormData({ username: res.data.usr.username, email: res.data.usr.email,phone:res.data.usr.phone });
        }
      } catch (error) {
        console.log("Error fetching user profile:", error);
      }
    };
    
    if (token) {
      fetchUser();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:3002/api/updateUser", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        setUser(res.data.updatedUser);
        setEditing(false);
      }
    } catch (error) {
      console.log("Error updating user profile:", error);
    }
  window.location.reload()
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <div className="profile-details">
        {editing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <label>
              Name:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>
            <div className="editsave">
            <button type="submit" className="save-button">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="cancel-button">Cancel</button>
            </div>
         
          </form>
        ) : (
          <>
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Role:</strong> {user.accType}</p>
            {!editing && <button onClick={() => setEditing(true)} className="edit-button">Edit</button>}
          </>
        )}
      </div>
      
      {user.accType === "publisher" ? (
        <Link to="/dashboard" className="dashboard-button">Publisher Dashboard</Link>
      ) : (
        <Link to="/history" className="history-button">History</Link>
      )}
    </div>
  );
};

export default Profile;

