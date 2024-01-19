import express, { Request, Response } from 'express'
const router = express.Router();

import { Products } from '../models/products.js';
import { Users } from '../models/users.js';
import { regPars } from '../functions.js';
import { findObjI } from '../interfaces.js';
import jwt from 'jsonwebtoken';
import { dateFormat } from '../functions.js';

router.get('/hit',(req :Request, res: Response) => {
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

router.get('/sliderLittle',(req :Request, res: Response) => {
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

router.get('/select',(req: Request, res: Response) => {
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

router.get('/goods/',(req: Request, res: Response) => {
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

router.get('/filter/:categ',(req: Request, res: Response) => {
    let categ = req.params.categ;
    const findObj:findObjI = {};
    const query = req.query;
    let keySort:string = "rating";
    let howSort:any =  -1;
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
        if(query.sort === "popular"){
            keySort = "popularity"; 
        } else {
            keySort = query.sort;
        }
    }
    if(query){
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

router.get('/products/:id',(req: Request, res: Response) => {
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
    
router.get('/comments/:id',(req: Request, res: Response) => {
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

router.post('/comments/:id',(req: Request, res: Response) => {
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

export default router;

