const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;


// middlewear
app.use(cors())
app.use(express.json());

async function run() {
    try {

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