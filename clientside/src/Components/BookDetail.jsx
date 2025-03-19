import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./scss/BookDetail.scss";

const BookDetail = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3002/api/getbook/${bookId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 200) {
          setBook(res.data.book);
        }
      } catch (error) {
        console.log("Error fetching book details:", error);
      }
    };
    fetchBookDetails();
  }, [bookId, token]);

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
          {/* Navigate to Booking Page */}
          <button
            className="btn book-now"
            onClick={() => navigate(`/book/${bookId}/booking`)}
          >
            Book Now
          </button>

          <button className="btn back" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
