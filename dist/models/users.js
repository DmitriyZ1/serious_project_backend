import Mongoose from "mongoose";
const Shema = Mongoose.Schema;
const usersSchema = new Shema({
    tel: String,
    name: String,
    mail: String,
    discounts: [String],
    bonuses: Number,
    appeals: [String],
    orders: [String],
});
export const Users = Mongoose.model('User', usersSchema);
