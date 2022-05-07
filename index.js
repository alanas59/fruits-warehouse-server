const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.64dyk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
     await client.connect();
     const fruitsCollection = client.db("fruitsInventory").collection("fruits");
     app.get('/fruits',async(req,res)=>{
        const query = {};
        const cursor = fruitsCollection.find(query);
        const fruits = await cursor.toArray();
        res.send(fruits);
     })

   }
   finally{

   }
}

run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.get('/home',(req,res)=>{
    res.send('This is home page');
})

app.listen(port,()=>{
    console.log('listening...');
})