import express from 'express'

import { __dirname } from './functions.js';

import Mongoose from 'mongoose';
import cors from 'cors';

import {PORT, URLdb, CORS, optionsMongo} from './settings.js'

import userRouter from './routing/user.js'
import cityRouter from './routing/city.js'
import photosRouter from './routing/photos.js'
import productsRouter from './routing/products.js'
 

const app = express();

app.use(express.json());

app.use(cors({
    origin: CORS,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
}));

app.use(userRouter);
app.use(productsRouter);
app.use(cityRouter);
app.use(photosRouter);

Mongoose
    .connect(URLdb)
    .then(() => console.log(`connect db`))
    .catch((err) => console.log(`error db : ${err}`));

app.listen(PORT, ():void => {
    console.log('PORT : ' + PORT);
}) 


