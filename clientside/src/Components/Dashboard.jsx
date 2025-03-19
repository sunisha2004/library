import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./scss/Dashboard.scss";
import { FaPlus } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Token:", token); // Debugging: Check if token is available

    const fetchUserRole = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Profile API Response:", res.data); // ✅ Correct placement

        if (res.status === 200 && res.data.usr?.accType) {
          setUserRole(res.data.usr.accType);
        } else {
          console.error("No valid accType found, redirecting...");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserRole();
    } else {
      navigate("/login");
    }
  }, [navigate, token]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Publisher Dashboard</h2>

      {userRole === "publisher" ? (
        <div className="dashboard-actions">
          <button className="add-book-btn" onClick={() => navigate("/addbook")}>
            <FaPlus /> Add Book
          </button>

          <button className="bookings-btn" onClick={() => navigate("/orders")}>
            View Bookings
          </button>
        </div>
      ) : (
        <p className="error-message">Access Denied. Only publishers can access this page.</p>
      )}
    </div>
  );
};

export default Dashboard;
