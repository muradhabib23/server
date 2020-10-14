const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2azhx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("Creative Agency On Action")
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const orderCollection = client.db("creativeAgency").collection("orders");
  const reviewCollection = client.db("creativeAgency").collection("orders");
  const serviceCollection = client.db("creativeAgency").collection("orders");
  
  app.post('/addOrder', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const service = req.body.service;
    const detail = req.body.detail;
    const price = req.body.price
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };

    orderCollection.insertOne({ name, email, image, service, detail, price })
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})

app.get('/orders', (req, res) => {
    orderCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});

app.post('/review', (req, res) => {
    const name = req.body.name;
    const company = req.body.company;
    const description = req.body.description;
        reviewCollection.insertOne({name, company, description})
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

});

app.listen(process.env.PORT || port)