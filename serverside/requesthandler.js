import jwt from 'jsonwebtoken';
import userSchema from './Models/user.model.js';
import bookSchema from './Models/book.model.js'
import orderSchema from './Models/order.model.js'
import Issue from "./models/issue.model.js"; 
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import pkg from "jsonwebtoken";

import bcrypt from 'bcrypt';

const transporter = nodemailer.createTransport({
    service: "gmail",
     auth: {
       user: "sunishams2004@gmail.com",
       pass: "xgrj cojw wpfl stau",
     },
  });

export async function addUser(req, res) {
    try {
        const { username, email, phone, accType, pwd, cpwd } = req.body;

        if (!(username && email && pwd && cpwd)) {
            return res.status(400).send({ msg: "All fields are required" });
        }

        if (pwd !== cpwd) {
            return res.status(400).send({ msg: "Passwords do not match" });
        }

        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ msg: "Email already in use" });
        }

        const hashedPwd = await bcrypt.hash(pwd, 10);
        await userSchema.create({ username, email, phone, accType, pass: hashedPwd });

        res.status(201).send({ msg: "User successfully created" });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ msg: "Server error" });
    }
}


export async function login(req, res) {
    try {
        const { email, pass } = req.body;

        if (!(email && pass)) {
            return res.status(400).send({ msg: "Fields cannot be empty" });
        }

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).send({ msg: "Email does not exist" });
        }

        const success = await bcrypt.compare(pass, user.pass);
        if (!success) {
            return res.status(400).send({ msg: "Invalid email or password" });
        }

        const token = jwt.sign({ UserID: user._id }, process.env.JWT_KEY, { expiresIn: "24h" });

        res.status(200).send({ token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ msg: "Server error" });
    }
}

export async function verifyEmail(req, res) {
  
    const { email } = req.body;
  
    if (!email) {
      return res.status(500).send({ msg: "fields are empty" });
    }
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(500).send({ msg: "email not exist" });
    } else {
      const info = await transporter.sendMail({
        from: "sunishams2004@gmail.com",
        to: email,
        subject: "verify",
        text: "VERIFY! your email",
        html: `
      <div style="
           max-width: 600px; 
           margin: 0 auto; 
           padding: 20px; 
           font-family: Arial, sans-serif; 
           background-color: #f9f9f9; 
           border: 1px solid #e0e0e0; 
           border-radius: 10px; 
           text-align: center;">
           <h2 style="color: #333;">Email Verification</h2>
           <p style="color: #555; font-size: 16px;">
             Hi there! Click the button below to verify your email address and complete the registration process.
           </p>
           <a href="http://localhost:5173/resetpassword" style="
             display: inline-block; 
             margin-top: 20px; 
             padding: 10px 20px; 
             font-size: 16px; 
             color: #ffffff; 
             background-color: #007BFF; 
             text-decoration: none; 
             border-radius: 5px;
             font-weight: bold;">
             Verify Email
           </a>
           <p style="color: #999; font-size: 14px; margin-top: 20px;">
             If you did not request this email, you can safely ignore it.
           </p>
         </div>
         `,
       });
      console.log("Message sent: %s", info.messageId);
      res.status(200).send({ msg: "Verificaton email sented" });
    }
  }

  export async function verifyRegister(req, res) {
    console.log("hyyy");
    
    const { email } = req.body;
  
    if (!email) {
      return res.status(500).send({ msg: "fields are empty" });
    }
    const user = await userSchema.findOne({ email });
    if (user) {
      return res.status(500).send({ msg: "email not exist" });
    } else {
      const info = await transporter.sendMail({
        from: "sunishams2004@gmail.com",
        to: email,
        subject: "verify",
        text: "VERIFY! your email",
        html: `
      <div style="
           max-width: 600px; 
           margin: 0 auto; 
           padding: 20px; 
           font-family: Arial, sans-serif; 
           background-color: #f9f9f9; 
           border: 1px solid #e0e0e0; 
           border-radius: 10px; 
           text-align: center;">
           <h2 style="color: #333;">Email Verification</h2>
           <p style="color: #555; font-size: 16px;">
             Hi there! Click the button below to verify your email address and complete the registration process.
           </p>
           <a href="http://localhost:5173/register" style="
             display: inline-block; 
             margin-top: 20px; 
             padding: 10px 20px; 
             font-size: 16px; 
             color: #ffffff; 
             background-color: #007BFF; 
             text-decoration: none; 
             border-radius: 5px;
             font-weight: bold;">
             Verify Email
           </a>
           <p style="color: #999; font-size: 14px; margin-top: 20px;">
             If you did not request this email, you can safely ignore it.
           </p>
         </div>
         `,
       });
      console.log("Message sent: %s", info.messageId);
      res.status(200).send({ msg: "Verificaton email sented" });
    }
  }
  
export async function updatePassword(req, res) {
    const { pass, cpass, email } = req.body;
    console.log(req.body);
    if (pass != cpass) return res.status(500).send({ msg: "password missmatch" });
    bcrypt
      .hash(pass, 10)
      .then((hpwd) => {
        userSchema
          .updateOne({ email }, { $set: { pass: hpwd } })
          .then(() => {
            res.status(201).send({ msg: "Password changed successfully" });
          })
          .catch((error) => {
            res.status(404).send({ error: error });
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  export async function getUserData(req, res) {
    const usr = await userSchema.findOne({ _id: req.user.UserID });
    res.status(200).send({ usr });
  }

  export async function updateUserData(req, res) {
    try {
      const { username, email, phone, accType } = req.body;
      const updatedData = await userSchema.updateOne(
        { _id: req.user.UserID },
        { $set: { username, email, phone, accType } }
      );
      res
        .status(200)
        .send({ msg: "Data updated successfully!", data: updatedData });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Failed to update data. Please try again." });
    }
  }

export async function addBook(req,res) {
    try{
        const {...data} = req.body;
        const library = await bookSchema.create({
            sellerID:req.user.UserID,...data,
        })
        return res.status(201).json({message:"added successfully",library:library});

    }catch(error){
        console.log("error adding book",error);
        return res.status(500).json({message:"server error adding book"})
        
    }
    
}


export async function getAllBookss(req, res) {
  try {
    const books = await bookSchema.find({});

    if (!books || books.length === 0) {
      return res.status(404).send({ msg: "No products found." });
    }

    res.status(200).send({ msg: "Products fetched successfully!", books });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .send({
        msg: "Failed to fetch products. Please try again later.",
        error: error.message,
      });
  }
}

export async function getBookById(req, res) {
  try {
    const { bookId } = req.params; 
    const book = await bookSchema.findById(bookId);

    if (!book) {
      return res.status(404).send({ msg: "Book not found." });
    }

    res.status(200).send({ msg: "Book fetched successfully!", book });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).send({
      msg: "Failed to fetch book. Please try again later.",
      error: error.message,
    });
  }
}


export async function bookBook(req, res) {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ msg: "User ID and Book ID are required." });
    }

    const book = await bookSchema.findById(bookId);
    if (!book) {
      return res.status(404).json({ msg: "Book not found." });
    }

   
    if (book.quantity <= 0) {
      return res.status(400).json({ msg: "Book is out of stock." });
    }


    const issueDate = new Date();

   
    const returnDate = new Date();
    returnDate.setDate(issueDate.getDate() + 7);

    const newIssue = new issueSchema({
      UserID: userId,
      bookID: bookId,
      issueDate,
      returnDate,
      status: true, 
    });

    await newIssue.save();

    book.quantity -= 1;
    await book.save();

    res.status(201).json({
      msg: "Book issued successfully!",
      issueDetails: {
        issueId: newIssue._id,
        userId,
        bookId,
        issueDate,
        returnDate,
        status: "Issued",
      },
    });
  } catch (error) {
    console.error("Error booking book:", error);
    res.status(500).json({
      msg: "Failed to issue book. Please try again later.",
      error: error.message,
    });
  }
}


export const reserveBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.UserID; 
        

        const book = await bookSchema.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.quantity <= 0) {
            return res.status(400).json({ message: "Book is out of stock" });
        }

        const issueDate = new Date();
        const returnDate = new Date();
        returnDate.setDate(issueDate.getDate() + 7);

        // Create reservation
        const newReservation = new Issue({
            UserID: userId,
            bookID: bookId,
            issueDate,
            returnDate,
            status: "Booked", 
        });

        await newReservation.save();

        // Reduce book stock
        book.quantity -= 1;
        await book.save();

        // ✅ Create a new order for the publisher
        const newOrder = new orderSchema({
            sellerID: book.sellerID,  // Assuming book has a sellerID
            buyerID: userId,
            bookID: bookId,
            confirm: false,  // Default: not confirmed yet
        });

        await newOrder.save();

        res.status(201).json({
            message: "Booking Confirmed & Order Sent!",
            reservation: newReservation,
            order: newOrder,
            updatedBook: book
        });

    } catch (error) {
        console.error("Error reserving the book:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



export const getBookingHistory = async (req, res) => {
    try {
        const userId = req.user.UserID; 

        const reservations = await Issue.find({ UserID: userId });

        if (!reservations.length) {
            return res.status(404).json({ message: "No booking history found." });
        }

        const history = await Promise.all(
            reservations.map(async (reservation) => {
                const book = await bookSchema.findById(reservation.bookID); 

                return {
                    bookName: book?.name || "Unknown",
                    author: book?.author || "Unknown",
                    thumbnail: book?.thumbnail || "https://via.placeholder.com/100", 
                    issueDate: reservation.issueDate,
                    returnDate: reservation.returnDate,
                    status: reservation.status,
                };
            })
        );

        res.status(200).json({ history });
    } catch (error) {
        console.error("Error fetching booking history:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export async function getOrder(req, res) {
  try {
    const orders = await orderSchema.find({ sellerID: req.user.UserID });
    console.log(orders);
    
    if (!orders.length) {
      return res.status(404).json({ msg: "No orders found for this seller." });
    }

    const detailedOrders = await Promise.all(
      orders.map(async (item) => {
        const book = await bookSchema.findById(item.bookID);
        const issue = await Issue.findOne({ bookID: item.bookID, UserID: item.buyerID });
        console.log(issue);
        return {
          _id: item._id, // Ensure ID is returned
          bookname: book ? book.name : "Unknown Book",
          bookID: item.bookID,
          confirm: item.confirm, // Make sure confirm status is included
          status:issue.status
        };
      })
    );
    res.status(200).json(detailedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      msg: "Failed to fetch orders. Please try again later.",
      error: error.message,
    });
  }
}

export async function confirmOrder(req, res) {
  try {
      const { orderId } = req.params;

      // Find and update the order
      const updatedOrder = await orderSchema.findByIdAndUpdate(
          orderId,
          { confirm: true },
          { new: true }
      );

      if (!updatedOrder) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order confirmed!", order: updatedOrder });
  } catch (error) {
      console.error("Error confirming order:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
export const returnBook = async (req, res) => {
    try {
        const { orderId } = req.params;

        console.log("Looking for order with ID:", orderId);

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        console.log("Order found:", order);

        order.status = "Returned"; 
        await order.save();

        console.log(`Order ${orderId} marked as returned.`);

        return res.status(200).json({ message: "Order returned successfully" });
    } catch (error) {
        console.error("Error returning order:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



export const returnOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderSchema.findById(orderId);
        console.log(order.bookID,order.buyerID);
        
        
        if (!order) {
            console.error(`Order not found for ID: ${orderId}`);
            return res.status(404).json({ message: "Order not found." });
        }

        console.log(`Order found:`, order);

        console.log(`Order ${orderId} marked as returned.`);

        const issueRecord = await Issue.findOne({ bookID: order.bookID, UserID: order.buyerID });
        console.log(issueRecord);
        

        if (issueRecord) {
            issueRecord.status = "Returned";
            await issueRecord.save();
            console.log(`Issue history updated for bookID: ${order.bookID}`);
        } else {
            console.warn(`No matching issue record found for bookID: ${order.bookID}`);
        }

        res.status(200).json({ message: "Order and history updated successfully." });

    } catch (error) {
        console.error("Error returning order:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
