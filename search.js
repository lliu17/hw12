// requires
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const e = require("express");
app.use(bodyParser.urlencoded({ extended:true }));

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://nugget:123321@cluster0.vqeiy.mongodb.net/?retryWrites=true&w=majority";

const fs = require("fs");

// set up port 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

// set up page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/stockTicker.html");
})

// post action 
app.post("/", function (req, res) {
    const name = req.body.name;
    console.log(name);
    
    // connect to mongo
    MongoClient.connect(url,  { useUnifiedTopology: true }, (err, client) => {
        if (err) return console.error(err);
        else console.log("connected to db");

        const db = client.db("companies");
        const collection = db.collection("companies");

        collection.find({$or: [{"Company": new RegExp(name)}, 
                               {"Ticker": new RegExp(name)}]})
            .toArray(function(err, result) {

                if (err) return console.error(err);
                else {
                    const query = result;
                    console.log(query);
                    client.close();

                    if (query.length >= 1) {                  
                        // console.log(query[0].Company);
                        // console.log(query[0].Ticker);
  
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        for (i=0; i<query.length; i++) {
                            res.write("Company name: " + query[i].Company + "<br>");
                            res.write("Ticker: " + query[i].Ticker + "<br>");
                            res.write("<br>(refresh for new search)");
                        }
                    }
                    else {
                        res.write("not found (refresh for new search)");
                    }
                    res.end();
                }
        });
    });
});