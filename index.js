const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if(!authHeader){
      return res.status(401).send({message:'unauthorized access'});
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
     if(err){
         return res.status(403).send({message:'FORBIDDEN'});

     }
     req.decoded = decoded;
     console.log('Decoded',decoded);
  })

  next();
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.64dyk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const fruitsCollection = client.db("fruitsInventory").collection("fruits");
    const supportsCollection = client
      .db("fruitsInventory")
      .collection("supports");

    //AUTH
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

    //post fruit
    app.post("/fruits", async (req, res) => {
      const fruit = req.body;
      const result = await fruitsCollection.insertOne(fruit);
      res.send(result);
    });
    //get all products
    app.get("/fruits",verifyJWT,async (req, res) => {
      const query = {};
      const cursor = fruitsCollection.find(query);
      const fruits = await cursor.toArray();
      res.send(fruits);
    });
    //get single
    app.get("/fruits/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const fruit = await fruitsCollection.findOne(query);
      console.log(fruit);
      res.send(fruit);
    });
    //get supports data
    app.get("/supports", async (req, res) => {
      const query = {};
      const cursor = supportsCollection.find(query);
      const supports = await cursor.toArray();
      res.send(supports);
    });
    //update fruit
    app.put("/fruits/:id", async (req, res) => {
      const id = req.params.id;
      const updatedQuantity = req.body;
      const options = { upsert: true };
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: updatedQuantity,
      };
      const result = await fruitsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //delete api
    app.delete("/fruits/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await fruitsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/home", (req, res) => {
  res.send("This is home page");
});

app.listen(port, () => {
  console.log("listening...");
});
