import express, { Request, Response } from 'express'
const router = express.Router();

import jwt from 'jsonwebtoken';
import { Users } from '../models/users.js';
import { UserI, FormUserI } from '../interfaces.js';

router.post('/login',(req: Request, res: Response) => {
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

router.post('/reg',(req: Request, res: Response) => {
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

router.patch('/edit',(req: Request, res: Response) => {
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

router.post('/user',(req: Request, res: Response) => {
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

export default router;