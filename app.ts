import express, { Request, Response }  from 'express'
import jwt from 'jsonwebtoken';
import fs from 'fs'
import path from 'path';
import stream from 'stream';

import { regPars } from './functions.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Mongoose from 'mongoose';
import { Products } from './models/products.js';
import { Cities } from './models/cities.js';
import { Users } from './models/users.js';

import cors from 'cors';

import { dateFormat } from './dateFormat.js';

import { UserI, FormUserI, findObjI } from './interfaces.js';

import {PORT, URLdb, CORS} from './settings.js'

const app = express();

app.use(express.json());

app.use(cors({
    origin: CORS,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
}));

Mongoose
    .connect(URLdb)
    .then(() => console.log(`connect db`))
    .catch((err) => console.log(`error db : ${err}`));

app.listen(PORT, ():void => {
    console.log('PORT : ' + PORT);
}) 

app.post('/login',(req: Request, res: Response) => {
    const phone = req.body.phone;
    if(phone){
        Users
        .findOne({ tel: phone })
        .then(data => {
            if(data){
                const token = jwt.sign(
                    {phone},
                    'myfakesitemarket',
                    {expiresIn: '1h'}
                )
                res
                .status(200)
                .json({action: "ok", user:data, token})
            } else {
                res
                .status(200)
                .json({action: "not found"})
            }
        })
        .catch(() => {
            res
            .status(500)
            .json({error: 'db error'})
        }) 
    }
})   

app.post('/reg',(req: Request, res: Response) => {
    const form:FormUserI  =  req.body;
    if(form){
        const userForm:UserI = {
            tel: form.tel,
            name: form.name,
            mail: form.mail,
            discounts:[],
            bonuses: 0,
            appeals:[],
            orders:[],
        }
        const token = jwt.sign(
            {phone: userForm.tel},
            'myfakesitemarket',
            {expiresIn: '1h'}
        )
        const user = new Users(userForm);
        user
            .save()
            .then(() => {
                res
                .status(201)
                .json({action: "ok", user, token}) 
            })
            .catch(() => {
                res
                .status(500)
                .json({error: 'db error'})
            }) 
    }
})   

app.patch('/edit',(req: Request, res: Response) => {
    const token = req.body.userToken;
    const form = req.body.form;
    if(token){
        jwt.verify(token, 'myfakesitemarket', (err:any, decod:any) => {
            if(!err){
                const phone = decod.phone;
                Users
                    .findOne({tel:phone})
                    .then(data => {
                        if(data){
                            Users
                                .findByIdAndUpdate(data?.id, form)
                                .then(() => {
                                    res
                                        .status(200)
                                        .json({action: "ok"})
                                })
                                .catch(() => {
                                    res
                                    .status(500)
                                    .json({error: 'db error'})
                                }) 
                        }
                    })
                    .catch(() => {
                        res
                        .status(500)
                        .json({error: 'db error'})
                    }) 
            } else {
                res
                    .status(200)
                    .json({action: "token expired"})
            }
        })
    }
})   

app.post('/user',(req: Request, res: Response) => {
    const token = req.body.userToken;
    if(token){
        jwt.verify(token, 'myfakesitemarket', (err:any, decod:any) => {
            if(!err){
                const phone = decod.phone;
                Users
                    .findOne({tel:phone})
                    .then(data => {
                        if(data){
                            res
                                .status(200)
                                .json({action: "ok", user: data}) 
                        }else{
                            res
                                .status(200)
                                .json({action: "not found"})
                        }
                    })
                    .catch(() => {
                        res
                            .status(500)
                            .json({error: 'db error'})
                    }) 
            } else {
                res
                    .status(200)
                    .json({action: "token expired"})
            }
        })
    }
})  


app.get('/shops/:city',(req :Request, res: Response) => {
    const city = req.params.city;
    Cities
    .find({location: city})
    .then(data => {
        res
        .status(200)
        .json(data)
    })
    .catch(() => {
        res
        .status(500)
        .json({error: 'db error'})
    })
})


app.get('/hit',(req :Request, res: Response) => {
    Products
        .find({popularity: {$gte: 10}}, null, {limit: 7})
        .then(data => {
            res
            .status(200)
            .json(data)
        })
        .catch(() => {
            res
            .status(500)
            .json({error: 'db error'})
    })
})   

app.get('/sliderLittle',(req :Request, res: Response) => {
    Products
        .find({popularity: 10}, null, {limit: 3})
        .then(data => {
            res
            .status(200)
            .json(data)
        })
        .catch(() => {
            res
            .status(500)
            .json({error: 'db error'})
    })
})   

app.get('/select',(req: Request, res: Response) => {
    const query = req.query.id
    if(typeof query === 'string'){
        const parsArr:string[] = query.split(',')
        Products
            .find({_id: {$in: parsArr} })
            .then(data => {
                res
                .status(200)
                .json(data)
            })
            .catch(() => {
                res
                .status(500)
                .json({error: 'db error'})
            })
    }
})   

interface DataObjType{
    count: number,
    data: any
}

app.get('/goods/',(req: Request, res: Response) => {
    const search = req.query.search;
    const page = req.query?.page || 1;
    const reg = regPars(search);
    if(typeof search === 'string'){
        const dataObj:DataObjType = {count: 0, data: []};
        Products
            .find({description: {$regex: reg, $options: 'i'}})
            .then(data => {
                dataObj.count = data.length;
                Products
                .find({description: {$regex: reg, $options: 'i' }}, null, {limit: 10 * +page} )
                .then(data => {
                    dataObj.data = data
                    res
                    .status(200)
                    .json(dataObj)
                })
                .catch(() => {
                    res
                    .status(500)
                    .json({error: 'db error'})
                })
            })
            .catch(() => {
                res
                .status(500)
                .json({error: 'db error'})
            })
    } else {
        res
        .status(404)
        .json({error: 'error params'})
    }
})   

app.get('/filter/:categ',(req: Request, res: Response) => {
    let categ = req.params.categ;
    const findObj:findObjI = {};
    const query = req.query;
    let keySort:string = "rating";
    let howSort:any =  -1;
    console.log(query)
    if(categ){
        if(categ === 'bicycles') {categ = 'bicycle'};
        findObj.category = categ;
    }
    if(typeof query.brand === 'string'){
        let brandArr = query.brand.split(',');
        findObj.label = {$in : brandArr};
    }
    if(typeof query.category === 'string'){
        const a:String[] = [];
        let genderArr = query.category.split(',');
        if(genderArr.includes('man')){a.push("Унисекс"), a.push("Мужчины")}
        if(genderArr.includes('woman')){a.push("Унисекс"), a.push("Женщины")}
        if(genderArr.includes('child')){a.push("Мальчики"); a.push("Девочки"), a.push("Дети")}
        findObj["characteristic.gender"] = {$in : a};
    }
    if(typeof query.price === 'string'){
        let priceArr = query.price.split(',');
        findObj.price = {$lte: +priceArr[1], $gte: +priceArr[0]}
    }
    if(typeof query.sort === 'string'){
        if(query.sort === 'price'){
            howSort = 1
        } else {
            howSort = -1
        }
        keySort = query.sort;
    }
    if(query){
        console.log(query)
        const page = query?.page || 1; 
        Products
            .find(findObj, 
                null,
                {limit: 8 * +page})
            .sort({[keySort]: howSort})
            .then(data => {
                res
                .status(200)
                .json(data)
            })
            .catch(() => {
                res
                .status(500)
                .json({error: 'db error'})
            })
    }
})   

app.get('/products/:id',(req: Request, res: Response) => {
    const id = req.params.id;
    if(id){
        Products
            .findById(id)
            .then(data => {
                if(data){
                    res
                    .status(200)
                    .json(data)
                } else (
                    res
                    .status(404)
                    .json({error: 'not in db'})
                )
            })
            .catch(() => {
                res
                .status(500)
                .json({error: 'db error'})
            })
    } else {
        res
            .status(404)
            .json({error: 'error params'})
    }
})   
    
app.get('/comments/:id',(req: Request, res: Response) => {
    const id = req.params.id;
    if(id){
        Products
            .findById(id)
            .then(data => {
                console.log(data)
                if(data){
                    res
                    .status(200)
                    .json(data.coments)
                } else (
                    res
                    .status(404)
                    .json({error: 'not in db'})
                )
            })
            .catch(() => {
                res
                .status(500)
                .json({error: 'db error'})
            })
    } else {
        res
            .status(404)
            .json({error: 'error params'})
    }
})   

app.post('/comments/:id',(req: Request, res: Response) => {
    const id = req.params.id;
    const token = req.body.userToken;
    const form = req.body.form;
    
    if(token){
        jwt.verify(token, 'myfakesitemarket', (err:any, decod:any) => {
            if(!err){
                const phone = decod.phone;
                Users
                    .findOne({tel:phone})
                    .then(data => {
                        if(data){
                            const nameUser = data.name;
                            const idRandom:string = Math.random().toString(16).slice(2);
                            const date:string = dateFormat();
                            const objForm = {
                                id: idRandom,
                                date: date,
                                estimation: form.star,
                                name: nameUser,
                                text: form.text
                            }
                            Products
                                .findByIdAndUpdate(id, {$push: {coments: objForm}})
                                .then(data => {
                                    res
                                        .status(200)
                                        .json({action: "ok", data})
                                })
                                .catch(() => {
                                    res
                                        .status(500)
                                        .json({error: 'db error product '})
                                }) 
                        } else {
                            res
                                .status(404)
                                .json({error: 'user not in db'})
                        }
                    })
                    .catch(() => {
                        res
                            .status(500)
                            .json({error: 'db error user'})
                    }) 
            } else {
                res
                .status(200)
                .json({action: "token expired"})
            }
        })
    }
})   

app.get('/pic/:img',(req :Request, res: Response) => {
    const img = req.params.img;
    const r = fs.createReadStream(path.dirname(__dirname) + '/pic/products/' + img) 
    const ps = new stream.PassThrough() 
    stream.pipeline(
     r,
     ps, 
     (err) => {
      if (err) {
        return res
            .sendStatus(400); 
      }
    })
    ps.pipe(res) 
})
