import mongoose, { mongo } from "mongoose";

const bookSchema = new mongoose.Schema({
    sellerID:{type:String},
    author:{ type:String },
    name:{ type:String },
    description:{ type:String },
    quantity:{type:Number},
    thumbnail:{type:String},
    category:{ type:String }
})

export default mongoose.model.book||mongoose.model('book',bookSchema)