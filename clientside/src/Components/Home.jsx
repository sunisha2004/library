// import React, { useEffect, useState } from "react";
// import "./scss/Home.scss";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const categories = [
//   "Novel",
//   "Short Story",
//   "Poem",
//   "Art",
//   "Biography",
//   "Universe",
//   "Chemistry",
//   "Physics",
//   "Mathematics",
//   "Malayalam",
//   "History",
// ];

// const Home = ({ name }) => {
//   const token = localStorage.getItem("token");

//   const [books, setBooks] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const res = await axios.get("http://localhost:3002/api/getallbooks");
//         console.log(res);
//         if (res.status === 200) {
//           setBooks(res.data.books);
//         }
//       } catch (error) {
//         console.log("error fetching books:", error);
//       }
//     };
//     fetchBooks();
//   }, [token]);

//   const filteredbooks = books.filter((book) => {
//     const matchesCategory =
//       !selectedCategory || book.category === selectedCategory;
//     const matchesName = book.name
//       ?.toLowerCase()
//       .includes(name?.toLowerCase() || "");
//     return matchesCategory || matchesName;
//   });

//   return (
//     <>
//       <div className="home-page">
//         <h2>All Books</h2>
//         <div className="categories">
//           {categories.map((category) => (
//             <button
//               key={category}
//               className={`category-button ${
//                 selectedCategory === category ? "active" : ""
//               }`}
//               onClick={() => setSelectedCategory(category)}
//             >
//               {category}
//             </button>
//           ))}
//           {selectedCategory && (
//             <button
//               className="clear-filter-button"
//               onClick={() => setSelectedCategory("")}
//             >
//               Clear Filter
//             </button>
//           )}
//         </div>

//         {filteredbooks.length > 0 ? (
//           <div className="product-grid">
//             {filteredbooks.map((book) => (
//                 key={book._id}
//                 className="product-item"
              
//                 <Link to={`/book/${book._id}`}>
//                 <img
//                   src={book.thumbnail}
//                   alt={book.name}
//                   className="product-thumbnail"
//                 />
//                 </Link>
               
//                 <span className="product-name">{book.name}</span>
//                 <span className="product-author">{book.author}</span>
//                 <span className="pro-quantity">{book.quantity} books Available now</span>
//                 <br />
//                 <br />
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <p>No products found.</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default Home;
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

const Home = ({ name }) => {
  const token = localStorage.getItem("token");
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/getallbooks");
        console.log(res);
        if (res.status === 200) {
          setBooks(res.data.books);
        }
      } catch (error) {
        console.log("error fetching books:", error);
      }
    };
    fetchBooks();
  }, [token]);

  const filteredbooks = books.filter((book) => {
    const matchesCategory =
      !selectedCategory || book.category === selectedCategory;
    const matchesName = book.name
      ?.toLowerCase()
      .includes(name?.toLowerCase() || "");

    return matchesCategory && matchesName; // Changed `||` to `&&`
  });

  return (
    <div className="home-page">
      <h2>All Books</h2>
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
        {selectedCategory && (
          <button
            className="clear-filter-button"
            onClick={() => setSelectedCategory("")}
          >
            Clear Filter
          </button>
        )}
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
        <p>No products found.</p>
      )}
    </div>
  );
};

export default Home;
