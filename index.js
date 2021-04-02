const express = require('express')
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID=require('mongodb').ObjectID;

const port = 5000;
app.get('/',(req,res)=>{
  res.send('working')
})

const app = express()
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
console.log(process.env.DB_NAME)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5rirp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("haatBazar").collection("products");
  const ordersCollection = client.db("haatBazar").collection("orders");

  app.get('/products',(req,res)=>{
    productsCollection.find()
    .toArray((err,items)=>{
        res.send(items);
        // console.log('from database',items)
    })
})
app.get('/product/:id',(req,res)=>{
  console.log('from',req.params.id)
  productsCollection.find({_id:ObjectID(req.params.id) })
  .toArray((err,documents)=>{
      res.send(documents[0]);
  })
})
app.delete('/deleteProduct/:id',(req,res)=>{
  const id = ObjectID(req.params.id)
  console.log('delete this id',id)
  productsCollection.deleteOne({_id:id})
  .then(result=>{
    console.log('delete post',result.deletedCount)
    res.send(result.deletedCount>0)
  })
})
app.post('/addProduct',(req,res)=>{
    const newProduct = req.body;
    console.log('adding new product',newProduct);
    productsCollection.insertOne(newProduct)
    .then(result=>{
        console.log('inserted count',result.insertedCount)
        res.send(result.insertedCount > 0)
    })
})
app.post('/addOrder',(req,res)=>{
  const order = req.body;
  console.log('adding new product',order);
  ordersCollection.insertOne(order)
  .then(result=>{
      console.log('inserted count',result.insertedCount)
      res.send(result.insertedCount > 0)
  })
})
app.get('/bookings',(req,res)=>{
  ordersCollection.find({})
  .toArray((err,documents)=>{
    res.send(documents);
  })
})

});


app.listen(process.env.PORT || port)