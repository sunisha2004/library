import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import EmailVerify from "./Components/EmailVerify";
import Nav from "./Components/Nav";
import AddBook from "./Components/AddBook";
import Profile from "./Components/Profile";
import Dashboard from "./Components/Dashboard";
import BookDetail from "./Components/BookDetail";
import Booking from "./Components/Booking";
import History from "./Components/History";
import Order from "./Components/Order";
import VerifyEmail from "./Components/VerifyEmail";
import ResetPassword from "./Components/Resetpassword";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState(""); 

  return (
    <BrowserRouter>
      <Nav setName={setSearch} /> 
      <Routes>
        <Route path="/" element={<Home name={search} />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/emailverify" element={<EmailVerify />} />
        <Route path="/addbook" element={<AddBook />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book/:bookId" element={<BookDetail />} />
        <Route path="/book/:bookId/booking" element={<Booking />} />
        <Route path="/history" element={<History />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/verifyemail" element={<VerifyEmail/>} />
        <Route path="/resetpassword" element={<ResetPassword/>} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;

