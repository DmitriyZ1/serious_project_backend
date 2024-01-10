import Mongoose from "mongoose";
const Shema = Mongoose.Schema;
const citiesSchema = new Shema({
    name: String,
    address: String,
    regime: String,
    location: String,
    reting: Number
});
export const Cities = Mongoose.model('Citie', citiesSchema);
