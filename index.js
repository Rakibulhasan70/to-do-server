const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')


// middlewear
app.use(cors())
app.use(express.json());


function verifyJWT(req, res, next) {
    const authHeaders = req.headers.authorization
    if (!authHeaders) {
        return res.status(401).send({ message: 'unAuthorized access' })
    }
    const token = authHeaders.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}


const uri = "mongodb+srv://todo-project:U5jepteFx2sFHTIt@cluster0.faflb.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const productCollection = client.db('TODO').collection('to-do-app')

        // get all 
        app.get('/product', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const query = {}

            const cursor = productCollection.find(query)
            let products
            if (page || size) {
                products = await cursor.skip(page * size).toArray()
            }
            else {
                products = await cursor.toArray()
            }
            res.send(products)
        });

        // pagenation
        app.get('/productCount', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const count = await cursor.count();
            res.send({ count })
        })
        // ///////// ge single data
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query);
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

        // update kora
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updatUser = req.body;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    img: updatUser.img,
                    name: updatUser.name,
                    description: updatUser.description

                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, option)
            res.send(result);
        });


    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello Form Doctor Uncle')
})

app.listen(port, () => {
    console.log(`Doctors app listening on port ${port}`);
})