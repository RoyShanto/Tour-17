const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
// user: myDbUser1
// password: HtRtyLjjXUM3Iruj

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.i3qcq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        // const database = client.db("foodMaster");
        const database = client.db("Tourism");
        const usersCollection = database.collection("users");
        const travellersCollection = database.collection("Travellers");
        const ordersCollection = database.collection("orders");

        //GET API Users
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        //GET API Travellers
        app.get('/Travellers', async (req, res) => {
            const cursor = travellersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        //GET API Orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        // UNIQUE ID
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            console.log('load user with id', id);
            res.send(user);
        })

        // UNIQUE ID order
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await ordersCollection.findOne(query);
            console.log('load user with id', id);
            res.send(user);
        })

        // POST API add services
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('Got New User', req.body);
            console.log('Added User', result);
            // res.send('hit the post');
            res.json(result);
        })

        // POST API add Orders
        app.post('/orders', async (req, res) => {
            const newUser = req.body;
            const result = await ordersCollection.insertOne(newUser);
            res.json(result);
        })

        // UPDATE API Approved
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    address: updateUser.address,
                    description: updateUser.description,
                    name: updateUser.name,
                    email: updateUser.email,
                    img: updateUser.img,
                    price: updateUser.price,
                    product_id: updateUser.product_id,
                    status: updateUser.status
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            console.log('Updating user', id)
            res.json(result);
        })

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log('delete user with id', id);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running My CURD Server');
})
app.listen(port, () => {
    console.log('Running server on port', port);
})