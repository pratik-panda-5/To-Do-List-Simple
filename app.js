const express = require ('express');
const bodyParser = require('body-parser');
const app = express();
const date = require(__dirname + "/date.js");

console.log(date);

let items = []; 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res)
{
    res.render('list', {today : date(), items : items});
});

app.get('/about', function(req, res)
{
    res.render('about');
});

app.post('/', function (req, res) {
    let thing = req.body.newItem;
    thing = thing.trim();
    if(thing != "")
    {
        items.push(thing);
    }
    res.redirect('/');
});

app.listen(3000, function () {      
    console.log("server started!");
});