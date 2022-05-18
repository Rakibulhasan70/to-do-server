const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middlewear
app.use(cors())
app.use(express.json());



const uri = "mongodb+srv://todo-project:U5jepteFx2sFHTIt@cluster0.faflb.mongodb.net/?retryWrites=true&w=majority";

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const productCollection = client.db('TODO').collection('to-do-app')
        // get all 
        app.get('/product', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        });
        // insert kora
        app.post('/product', async (req, res) => {
            const newProduct = req.body
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })
        // delete
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        });


    }
    finally {

    }
}
run().catch(console.dir())


app.get('/', (req, res) => {
    res.send('Hello Form Doctor Uncle')
})

app.listen(port, () => {
    console.log(`Doctors app listening on port ${port}`);
})