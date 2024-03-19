const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config() ;
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

//  middleware 
app.use(cors())
app.use(express.json()) 
  
const uri = `mongodb+srv://${process.env.COFFEE_USER}:${process.env.COFFEE_PASSWORD}@cluster0.jcqpshi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` ;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect(); 
    // Send a ping to confirm a successful connection
    // main variable 
    const database = client.db('coffeeDB');
    const collection = database.collection('coffeeData')
    const userCollection = database.collection('user')
    const logInUser = database.collection('logInUser')
    // database send data 
    app.post('/coffee', async (req, res)=>{ 
        const coffes = req.body;
        const result = await collection.insertOne(coffes)
        res.send(result)
    })
    // send data server 
    app.get('/coffee', async(req, res)=>{
         const  coffee  =   collection.find();
         const result = await coffee.toArray();
         res.send(result)
    })
    // sand data serveer by id 
    app.get('/coffee/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await  collection.findOne(query)
        res.send(result)
    } )
    // update data name, , ,, , , 
    app.put('/coffee/:id',async (req, res)=>{
        const id = req.params.id;
        const coffee = req.body;
        const query = {_id: new ObjectId(id)}
        const option = {upsert : true}
        const update = {
            $set : {
                name: coffee.name,
                chef : coffee.chef,
                supplier : coffee.supplier,
                taste : coffee. taste,
                category : coffee.category,
                details : coffee.details,
                photo : coffee.photo
            }
        }
        const result = await collection.updateOne(query,update, option)
        res.send(result) 
    })
    // delet data database 
    app.delete('/coffee/:id', async(req, res)=>{ 
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await collection.deleteOne(query)
        res.send(result)
    })
  //  user relatet apis 
  app.post('/users', async (req, res)=>{
    const user = req.body;
    const result = await userCollection.insertOne(user)
    res.send(result)
       
  })
  //  read user data 
  app.get('/users',async (req, res)=>{
     
     const user  = userCollection.find()
     const query = await user.toArray()
     res.send(query)
   })

//   log in user 
app.post('/loginUser', async(req, res)=>{
  const user  = req.body;
  const result = await logInUser.insertOne(user)
  res.send(result)
})

// read log in user 
app.get('/loginUser',async (req, res)=>{
  const cursor = logInUser.find()
  const user = await cursor.toArray()
  res.send(user)
})
    // 
     await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir); 

app.get('/', (req, res)=>{
    res.send('database')
})
app.listen(port, ()=>{
    console.log(`server is running port : ${port}`)
})