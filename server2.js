var express = require("express");
var bodyParser = require("body-parser");

app = express();
app.use(express.static(__dirname));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://rohansarap:RXrvR1YZlEDnVA3B@cluster0-ksc05.gcp.mongodb.net/test?retryWrites=true&w=majority";

var dbo;
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    dbo = db.db("tetris");
    dbo.createCollection("scores", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        // db.close();
    });
    // dbo.collection("scores").drop(function(err, delOK) {
    //     if (err) throw err;
    //     if (delOK) console.log("Collection deleted");
    //     db.close();
    // });
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
  });
  
app.post("/sayHi", function(req, res) {
    console.log("hi");
});

app.get('/leaderboard', function(req, res) {
    var ino1 = req.param('ino') || '';
    var uname1 = req.param('uname') || '';
    var score1= parseInt(req.param('score')) || 0;
    
    try{
        if(ino1!="" && uname1!=""){
            dbo.collection("scores").updateOne(
                { ino: ino1, uname: uname1},
                { $max: { score: score1 } },
                { upsert: true }
            );
        }

        dbo.collection("scores").find({},{projection: {_id: 0}}).sort({score: -1}).toArray(function(err, result) {
            if (err) throw err;
            
            if(ino1!="" && uname1!=""){
                var cnt=1;
                for(let i=0;i<result.length;i++){
                    if(result[i].ino==ino1){
                        break;
                    }
                    else{
                        cnt+=1;
                    }
                }
                var x={ino: '0', uname: '0', score: cnt};
                result[5]=x;
            }
        
            // console.log(result);
            res.status(200);
            res.send(result);
        });
    }
    catch (e) {
        console.log(e);
    }
});

let port = process.env.PORT || 1234;

var server=app.listen(port,() => {
    console.log('Server listening on port',server.address().port)
})