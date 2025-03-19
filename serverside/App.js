import express from 'express'
import Connection from './connection.js'
import cors from 'cors'
import dotenv from 'dotenv'
import Router from './router.js'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({limit:'50mb'}));
app.use('/api',Router);

Connection().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server created at http://localhost:${process.env.PORT}`);

    });

    
}).catch((error)=>{
    console.log(error);
    
})