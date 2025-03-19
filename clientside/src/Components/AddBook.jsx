import React, { useState } from "react";
import axios from "axios";
import "./scss/AddBook.scss";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    author: "",
    description: "",
    quantity: "",
    thumbnail: "",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Convert image to base64
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input
  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertBase64(file);
      setFormData((prevData) => ({
        ...prevData,
        thumbnail: base64,
      }));
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const res = await axios.post(
        "http://localhost:3002/api/addbook",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        alert("Book added successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div className="add-book-container">
      <h2 className="title">Add Book</h2>
      <form onSubmit={handleSubmit} className="add-book-form">
        <div className="form-field">
          <label htmlFor="name">Book Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="input"
            min="1"
          />
        </div>

        <div className="form-field">
          <label htmlFor="thumbnail">Thumbnail Image:</label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
            className="file-input"
          />
          {thumbnailPreview && (
            <div className="image-preview">
              <img src={thumbnailPreview} alt="Thumbnail Preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
