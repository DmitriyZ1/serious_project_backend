import express from 'express';
import jwt from 'jsonwebtoken';
import Mongoose from 'mongoose';
import { Products } from './models/products.js';
import { Cities } from './models/cities.js';
import { Users } from './models/users.js';
import jsonfile from 'jsonfile';
import cors from 'cors';
const dbFake = './db/product.json';
const userbase = './db/users.json';
const shopsbase = './db/shops.json';
const PORT = 3300;
const URLdb = "mongodb://localhost:27017/bicycles";
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
}));
Mongoose
    .connect(URLdb)
    .then(() => console.log(`connect db`))
    .catch((err) => console.log(`error db : ${err}`));
app.listen(PORT, () => {
    console.log('PORT : ' + PORT);
});
app.get('/hit', cors({ origin: 'http://localhost:3000' }), (req, res) => {
    Products
        .find({}, null, { limit: 6 })
        .then(data => {
        res
            .status(200)
            .json(data);
    })
        .catch(() => {
        res
            .status(500)
            .json({ error: 'db error' });
    });
    // jsonfile.readFile(dbFake, (err, obj:ProductsInt) => {
    //     if (!err) {
    //         res
    //             .status(200)
    //             .json(obj.products)
    //     }else{
    //         res
    //             .status(400)
    //             .json({error: err})
    //     }       
    // })
});
app.get('/shops/:city', cors({ origin: 'http://localhost:3000' }), (req, res) => {
    const city = req.params.city;
    Cities
        .find({ location: city })
        .then(data => {
        res
            .status(200)
            .json(data);
    })
        .catch(() => {
        res
            .status(500)
            .json({ error: 'db error' });
    });
});
//     jsonfile.readFile(shopsbase, (err, obj:ShopsInt) => {
//         if (!err) {
//             const result = obj.shops.filter(elem => elem.location === city);
//             res
//                 .status(200)
//                 .json(result)
//         }else{
//             res
//                 .status(400)
//                 .json({error: err})
//         }       
//     })
// })   
app.get('/select', cors({ origin: 'http://localhost:3000' }), (req, res) => {
    const query = req.query.id;
    if (typeof query === 'string') {
        const parsArr = query.split(',');
        jsonfile.readFile(dbFake, (err, obj) => {
            if (!err) {
                const arrProductSelect = obj.products.filter(item => parsArr.find(elem => elem === item.id));
                res
                    .status(200)
                    .json({ arrProductSelect });
            }
            else {
                res
                    .status(400)
                    .json({ error: err });
            }
        });
    }
});
//поиск
app.get('/goods', cors({ origin: 'http://localhost:3000' }), (req, res) => {
    const query = req.query.search;
    if (typeof query === 'string') {
        jsonfile.readFile(dbFake, (err, obj) => {
            if (!err) {
                res
                    .status(200)
                    .json(obj.products);
            }
            else {
                res
                    .status(400)
                    .json({ error: err });
            }
        });
    }
});
app.get('/filter', cors({ origin: 'http://localhost:3000' }), (req, res) => {
    const query = req.query;
    if (query) {
        jsonfile.readFile(dbFake, (err, obj) => {
            if (!err) {
                res
                    .status(200)
                    .json(obj.products);
            }
            else {
                res
                    .status(400)
                    .json({ error: err });
            }
        });
    }
});
app.post('/login', (req, res) => {
    const phone = req.body.phone;
    if (phone) {
        Users
            .findOne({ tel: phone })
            .then(data => {
            if (data) {
                const token = jwt.sign({ phone }, 'myfakesitemarket', { expiresIn: '1h' });
                res
                    .status(200)
                    .json({ action: "ok", user: data, token });
            }
            else {
                res
                    .status(200)
                    .json({ action: "not found" });
            }
        })
            .catch(() => {
            res
                .status(500)
                .json({ error: 'db error' });
        });
    }
    // if(phone){
    //     jsonfile.readFile(userbase, (err, obj: UserInt) => {
    //         if (!err) {
    //             const user = obj.users.find(elem => elem.tel === phone);
    //             if(user){
    //                 const token = jwt.sign(
    //                     {phone},
    //                     'myfakesitemarket',
    //                     {expiresIn: '1h'}
    //                 )
    //                 res
    //                     .status(200)
    //                     .json({action: "ok", user, token})
    //             } else {
    //                 res
    //                     .status(200)
    //                     .json({action: "not found"})
    //             }
    //         } else {
    //             res
    //                 .status(400)
    //                 .json({error: err})
    //         }       
    //     })
    // }
});
app.post('/user', (req, res) => {
    const token = req.body.userToken;
    if (token) {
        jwt.verify(token, 'myfakesitemarket', (err, decod) => {
            if (!err) {
                const phone = decod.phone;
                Users
                    .findOne({ tel: phone })
                    .then(data => {
                    res
                        .status(200)
                        .json({ action: "ok", user: data });
                })
                    .catch(() => {
                    res
                        .status(500)
                        .json({ error: 'db error' });
                });
                // jsonfile.readFile(userbase, (errRead, obj: UserInt) => {
                //     if(!errRead){
                //         const phone = decod.phone;
                //         const user = obj.users.find(elem => elem.tel === phone)
                //         res
                //             .status(200)
                //             .json({action: "ok", user})
                //     } else {
                //         res
                //             .status(200)
                //             .json({action: "not found"})
                //     }
                // })
            }
            else {
                res
                    .status(200)
                    .json({ action: "token expired" });
            }
        });
    }
});
app.get('/products/:id', cors({ origin: 'http://localhost:3000' }), (req, res) => {
    const id = req.params.id;
    if (id) {
        jsonfile.readFile(dbFake, (err, obj) => {
            const product = obj.products.find(elem => elem.id === id);
            if (!err && product) {
                res
                    .status(200)
                    .json(product);
            }
            else if (!product) {
                res
                    .status(404)
                    .json({ error: 'not' });
            }
            else {
                res
                    .status(400)
                    .json({ error: err });
            }
        });
    }
});
app.get('/comments/:id', cors({ origin: 'http://localhost:3000' }), (req, res) => {
    const id = req.params.id;
    if (id) {
        jsonfile.readFile(dbFake, (err, obj) => {
            const product = obj.products.find(elem => elem.id === id);
            if (!err && product) {
                res
                    .status(200)
                    .json(product.coments);
            }
            else if (!product) {
                res
                    .status(404)
                    .json({ error: 'not' });
            }
            else {
                res
                    .status(400)
                    .json({ error: err });
            }
        });
    }
});
app.post('/comments/:id', cors({ origin: 'http://localhost:3000' }), (req, res) => {
    const id = req.params.id;
    const token = req.body.userToken;
    const form = req.body.form;
    if (token) {
        jwt.verify(token, 'myfakesitemarket', (err, decod) => {
            if (!err) {
                const phone = decod.phone;
                res
                    .status(200)
                    .json({ inf: { id, form, phone } });
            }
            else {
                res
                    .status(400)
                    .json({ err: err });
            }
        });
    }
});
app.put('/edit', cors({ origin: 'http://localhost:3000' }), (req, res) => {
    const token = req.body.userToken;
    const form = req.body.form;
    if (token) {
        jwt.verify(token, 'myfakesitemarket', (err, decod) => {
            if (!err) {
                jsonfile.readFile(userbase, (errRead, obj) => {
                    if (!errRead) {
                        const phone = decod.phone;
                        const user = obj.users.find(elem => elem.tel === phone);
                        res
                            .status(200)
                            .json({ action: "ok", user, form });
                    }
                    else {
                        res
                            .status(200)
                            .json({ action: "not found" });
                    }
                });
            }
            else {
                res
                    .status(400)
                    .json({ action: "token expired" });
            }
        });
    }
});
