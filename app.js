const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const date = require(__dirname + "/date.js");

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    }
});
const Item = mongoose.model("Item", itemSchema);



let items = []; 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res)
{
    Item.find({}, (err, items)=>{
        if(items.length === 0)
        {
            const item1 = new Item({
                name : 'Welcome to to-do list'
            });
            const item2 = new Item({
                name : 'Click on + button to add new tasks'
            });
            const item3 = new Item({
                name : '<- Press this to delete task'
            });
            const defaultItems = [item1, item2, item3];
            
            Item.insertMany(defaultItems, (err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("default items inserted");
                    // Item.find({}, (err, items)=>{
                    //     res.render('list', {today : date(), items : items});
                    // });
                }
            });
            res.redirect("/");
        }
        else{
            res.render('list', {today : date(), items : items});
        }
    });
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
        const item = new Item({
            name : thing
        });
        item.save();
    }
    res.redirect('/');
});

app.post('/delete', (req, res)=>{
    Item.deleteOne({_id : req.body.checkbox}, (err)=>{
        if(err)
        {
            console.log("vsad");
        }
        else{
            setTimeout(() => {
                res.redirect('/');
            }, 500);
        }
    })
});

app.listen(3000, function () {      
    console.log("server started!");
});