const express = require ('express');
const bodyParser = require('body-parser');
const { func } = require('assert-plus');

const app = express();

app.get("/", function(req, res)
{
    res.send("Hello!");
});


app.listen(3000, function () {      
    console.log("server started!");
});