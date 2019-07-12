var mongoose = require('mongoose');
const uri = "mongodb+srv://rohansarap:RXrvR1YZlEDnVA3B@cluster0-ksc05.gcp.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});


const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app2.use(express.static('./dist'));

app2.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname,'/dist/index.html'));
});

// Start the app by listening on the default Heroku port
app2.listen(process.env.PORT || 8080);

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => res.send('Hello World!'));

var Schema = mongoose.Schema;
var UsersSchema = new Schema ({
    name: String,
    inumber: String,
    score: Number
});

var model = mongoose.model('user', UsersSchema);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
  });

app.post("/api/saveUser", function(req, res) {
    var user1 = new model({name: req.body.name, inumber: "irandom", score: req.body.score});
    user1.save(function(err, model) {
        if (err) return console.error(err);
        console.log(model.name + ' ' + model.inumber + ' ' + model.score);
    });
});

app.get("/api/getUser", function(req, res) {
    model.find({}, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    }).sort({score: -1}).limit(5);
});

app.listen(3000, function(err,res) {
    if (err) console.log(err);
    console.log('App listening on port 3000');
})