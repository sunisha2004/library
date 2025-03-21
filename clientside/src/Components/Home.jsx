import React, { useEffect, useState } from "react";
import "./scss/Home.scss";
import axios from "axios";
import { Link } from "react-router-dom";

const categories = [
  "Novel",
  "Short Story",
  "Poem",
  "Art",
  "Biography",
  "Universe",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Malayalam",
  "History",
];

const Home = ({ name = "" }) => { 
  const token = localStorage.getItem("token");
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/getallbooks");
        if (res.status === 200) {
          setBooks(res.data.books);
        }
      } catch (error) {
        console.log("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [token]);

  const filteredbooks = books
    .filter((book) => book.quantity > 0) // Exclude books with quantity 0
    .filter((book) => {
      const bookName = book.name ? book.name.toLowerCase() : "";
      const bookAuthor = book.author ? book.author.toLowerCase() : "";
      return bookName.includes(name.toLowerCase()) || bookAuthor.includes(name.toLowerCase());
    })
    .filter((book) =>
      selectedCategory ? book.category?.toLowerCase() === selectedCategory.toLowerCase() : true
    );

  return (
    <div className="home-page">
      <h2>All Books</h2>
      <div className="categories">
        <button className='category-button' onClick={() => setSelectedCategory("")}>All</button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredbooks.length > 0 ? (
        <div className="product-grid">
          {filteredbooks.map((book) => (
            <div key={book._id} className="product-item">
              <Link to={`/book/${book._id}`}>
                <img
                  src={book.thumbnail}
                  alt={book.name}
                  className="product-thumbnail"
                />
              </Link>
              <span className="product-name">{book.name}</span>
              <span className="product-author">{book.author}</span>
              <span className="pro-quantity">
                {book.quantity} books Available now
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
};

export default Home;
