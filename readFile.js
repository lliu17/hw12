// requires
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended:true }));

const csvtojson = require("csvtojson");

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://nugget:123321@cluster0.vqeiy.mongodb.net/?retryWrites=true&w=majority";

// convert csv file to json
csvtojson().fromFile("companies-1.csv").then(csvData => {
    console.log(csvData);

    // connect to mongo
    MongoClient.connect(url,  { useUnifiedTopology: true }, (err, client) => {
        if (err) return console.error(err);
        else console.log("connected to db");

        const db = client.db("companies");
        const collection = db.collection("companies");

        collection.insertMany(csvData, (err, res) => {
            if (err) return console.error(err);
            else console.log(`data inserted: ${res.insertedCount} rows`);
            client.close();
        })
    });
});

// set up port 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));