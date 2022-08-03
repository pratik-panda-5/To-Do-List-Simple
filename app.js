const express = require ('express');
const bodyParser = require('body-parser');
const app = express();


let items = []; 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res)
{
    let date = new Date();
    let options = {
        weekday : 'long',
        day : 'numeric',
        month : 'long'
    }
    let today = date.toLocaleDateString('en-US', options);
    res.render('list', {today : today, items : items});
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