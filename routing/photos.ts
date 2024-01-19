import express, { Request, Response } from 'express'
const router = express.Router();
import fs from 'fs'
import path from 'path';
import stream from 'stream';
import { __dirname } from '../functions.js';


router.get('/pic/:img',(req :Request, res: Response) => {
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

export default router;