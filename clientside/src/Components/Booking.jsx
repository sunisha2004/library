import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./scss/Booking.scss";

const Booking = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [book, setBook] = useState(null);
    const [issueDate, setIssueDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [status, setStatus] = useState("Pending");

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:3002/api/getbook/${bookId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.status === 200) {
                    setBook(res.data.book);

                    // Set issue date (today)
                    const currentDate = new Date();
                    setIssueDate(currentDate.toDateString());

                    // Set return date (one week from today)
                    const returnDate = new Date();
                    returnDate.setDate(currentDate.getDate() + 7);
                    setReturnDate(returnDate.toDateString());
                }
            } catch (error) {
                console.log("Error fetching book details:", error);
            }
        };

        fetchBookDetails();
    }, [bookId, token]);

    // Function to confirm booking
    const handleConfirmBooking = async () => {
        try {
            const res = await axios.post(
                `http://localhost:3002/api/book/${bookId}/reserve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 201) {
                setStatus("Reserved");
                alert("Booking confirmed successfully!");
                navigate("/"); // Redirect to home page
            }
        } catch (error) {
            console.error("Error confirming booking:", error);
            alert("Booking failed. Please try again.");
        }
    };

    if (!book) {
        return <p>Loading booking details...</p>;
    }

    return (
        <div className="booking-container">
            <h2>Confirm Your Booking</h2>
            
            <div className="book-details">
                <img src={book.thumbnail} alt={book.name} className="book-thumbnail" />
                <h3>{book.name}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Description:</strong> {book.description}</p>
                <p><strong>Available Quantity:</strong> {book.quantity}</p>
            </div>

            <div className="booking-info">
                <p><strong>Issue Date:</strong> {issueDate}</p>
                <p><strong>Return Date:</strong> {returnDate}</p>
                <p><strong>Status:</strong> {status}</p>
            </div>

            <div className="buttons">
                <button className="btn confirm-booking" onClick={handleConfirmBooking}>
                    Confirm Booking
                </button>
                <button className="btn back" onClick={() => navigate(-1)}>Cancel</button>
            </div>
        </div>
    );
};

export default Booking;
