import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    sellerID: { type: String },
    buyerID: { type: String},
    bookID: { type: String},
    confirm: { type: Boolean},
});

export default mongoose.models.order || mongoose.model('order', orderSchema);
