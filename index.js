const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000

// middle wire 
app.use(cors())
app.use(express.json())

// bistroBoss Feuto184hR7uzwOD




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@bistro-boss-resturent-s.4y0htng.mongodb.net/?retryWrites=true&w=majority`;

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

        const BistroCollection = client.db("Bistro-boss").collection("menu")

        const userCollection = client.db("Bistro-boss").collection("users")

        const BistroReviewCollection = client.db("Bistro-boss").collection("reviews")

        const cartCollection = client.db("Bistro-boss").collection("carts")

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // User related info 
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })
        app.post('/users', async (req, res) => {

            const users = req.body;
            const query = { email: users.email }
            const existingUser = await userCollection.findOne(query);
            console.log("existing", existingUser)
            if (existingUser) {
                return res.send({ mssage: 'user Is already exists' })
            }
            const result = await userCollection.insertOne(users);
            res.send(result)
        })

        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            
            const updateDoc = { $set: { role: "admin" } };
            const result = await userCollection.updateOne(filter, updateDoc)
            console.log('result' , result)
            res.send(result)
        })
        app.delete('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
        app.get('/users/admin/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const filter = { _id: new ObjectId(id) };
            const result = await userCollection.find(filter).toArray();
            res.send(result)
        })

        app.get('/menu', async (req, res) => {
            const result = await BistroCollection.find().toArray();
            res.send(result)
        })
        app.get('/reviews', async (req, res) => {
            const result = await BistroReviewCollection.find().toArray();
            res.send(result)
        })

        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            // console.log(email)
            if (!email) {
                res.send([])
            }
            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/carts', async (req, res) => {
            const items = req.body;
            const result = await cartCollection.insertOne(items);
            res.send(result)
        })
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query);
            res.send(result)
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Bistro boss server')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})