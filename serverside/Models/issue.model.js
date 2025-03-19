import mongoose, { mongo } from "mongoose";
const issueSchema = new mongoose.Schema({
    UserID:{type:String},
    bookID:{type:String},
    issueDate:{type:Date},
    returnDate:{type:Date},
    status: { type: String, enum: ["Booked", "Returned"], default: "Booked" } 
})

export default mongoose.models.Issue || mongoose.model("Issue", issueSchema);