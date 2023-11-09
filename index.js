const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i9zoefc.mongodb.net/?retryWrites=true&w=majority`;



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
  

    const serviceCollection =client.db('rideService').collection('services');

    app.get('/services',async(req,res)=>{
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result); 
    })


    //  app.get('/services',async(req,res)=>{
    //   const cursor = serviceCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result); 
    // });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.findOne(query);
      res.send(result);
  });

  app.post('/services', async (req, res) => {
    const service = req.body;
    console.log(service);
    const result = await serviceCollection.insertOne(service);
    res.send(result);
})


app.put('/service/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const options = { upsert: true };
  const updatedService = req.body;

  const service = {
      $set: {
          serviceName: updatedService.serviceName,
          serviceImage: updatedService.serviceImage,
          serviceDescription: updatedService.serviceDescription,
          serviceArea: updatedService.serviceArea,
      }
  }

  const result = await serviceCollection.updateOne(filter, service, options);
  res.send(result);
})


  app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })


    // Send a ping to confirm a successful connection
   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('server is running')
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})