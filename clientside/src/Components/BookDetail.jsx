import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./scss/BookDetail.scss";

const BookDetail = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [book, setBook] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [hasBooked, setHasBooked] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3002/api/getbook/${bookId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 200) {
          setBook(res.data.book);
        }
      } catch (error) {
        console.log("Error fetching book details:", error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setUserRole(res.data.usr.accType.toLowerCase());
        }
      } catch (error) {
        console.log("Error fetching user profile:", error);
      }
    };

    fetchBookDetails();
    fetchUserProfile();
  }, [bookId, token]);

  useEffect(() => {
    if (!book || userRole === "publisher") return; 

    const fetchBookingHistory = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/booking/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Full Booking History API Response:", res.data);

        if (res.status === 200) {
          const userHistory = res.data.history || [];
          console.log("User Booking History:", userHistory);

          const alreadyBooked = userHistory.some(
            (entry) => entry.bookName === book.name
          );

          setHasBooked(alreadyBooked);
        }
      } catch (error) {
        console.log("Error fetching booking history:", error);
      }
    };

    fetchBookingHistory();
  }, [book, token, userRole]);

  if (!book) {
    return <p>Loading..........</p>;
  }

  return (
    <div className="book-detail">
      <div className="book-container">
        <img src={book.thumbnail} alt={book.name} className="book-thumbnail" />
        <div className="book-title">{book.name}</div>
        <div className="book-author">By {book.author}</div>
        <div className="book-description">{book.description}</div>
        <div className="book-quantity">{book.quantity} books available</div>

        <div className="buttons">
          {userRole !== "publisher" && (
            hasBooked ? (
              <p className="already-booked-msg">You have already booked this book.</p>
            ) : (
              <button
                className="btn book-now"
                onClick={() => navigate(`/book/${bookId}/booking`)}
              >
                Book Now
              </button>
            )
          )}

          <button className="btn back" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
