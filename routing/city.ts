import express, { Request, Response } from 'express'
const router = express.Router();
import { Cities } from '../models/cities.js';

router.get('/shops/:city',(req :Request, res: Response) => {
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

export default router;