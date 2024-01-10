import Mongoose from "mongoose";
const Shema = Mongoose.Schema;
const productsSchema = new Shema({
    category: String,
    prise: Number,
    label: String,
    model: String,
    description: String,
    rating: Number,
    popularity: Number,
    photos: [String],
    coments: [{
            id: String,
            date: String,
            estimation: Number,
            name: String,
            text: String
        }],
    text: String,
    characteristic: {
        dia: Number,
        gender: String,
        color: String,
        helm: String,
        frame: String,
        mass: Number
    },
});
export const Products = Mongoose.model('Product', productsSchema);
