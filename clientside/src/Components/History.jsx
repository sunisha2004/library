import axios from "axios";
import React, { useEffect, useState } from "react";
import "./scss/History.scss";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistory();
  }, []);

  // ✅ Fetch booking history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3002/api/booking/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setHistory(res.data.history);
      }
    } catch (error) {
      console.error("❌ Error fetching booking history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-container">
      <h2>Booking History</h2>

      {loading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <p>No booking history available.</p>
      ) : (
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <img src={item.thumbnail} alt={item.bookName} />
              <div className="book-info">
                <strong>{item.bookName}</strong> by {item.author} <br />
                <small>Issued: {new Date(item.issueDate).toDateString()}</small> |
                <small> Return: {new Date(item.returnDate).toDateString()}</small> |
                <small className={`status ${item.status === "Booked" ? "active" : "returned"}`}>
                  {item.status === "Booked" ? "Booked" : "Returned"}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
