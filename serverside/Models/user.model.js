import mongoose, { mongo } from "mongoose";
import { type } from "os";
const userSchema = new mongoose.Schema({
    username: { type:String },
    email: { type: String },
    phone: { type:Number},
    accType: {type:String},
    pass:{ type:String},
})
export default mongoose.model.user||mongoose.model('user',userSchema)