const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.get('/home',(req,res)=>{
    res.send('This is home page');
})

app.listen(port,()=>{
    console.log('listening...');
})