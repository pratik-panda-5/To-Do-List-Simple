const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const date = require(__dirname + "/date.js");

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model("Item", itemSchema);

const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome to to-do list",
});
const item2 = new Item({
  name: "Click on + button to add new tasks",
});
const item3 = new Item({
  name: "<- Press this to delete task",
});
const defaultItems = [item1, item2, item3];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Item.find({}, (err, items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("default items inserted");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { today: date(), items: items });
    }
  });
});

app.get("/:listName", (req, res) => {
  const customListName = req.params.listName;
  if (customListName != "favicon.ico") {
    List.findOne({ name: customListName }, (err, foundList) => {
      if (foundList != null) {
        res.render("list", { today: foundList.name, items: foundList.items });
      } else {
        const myP = new Promise((resolve, reject) => {
          const list = new List({
            name: customListName,
            items: defaultItems,
          });
          list.save();
          console.log("nahi tha toh add krdia");
          resolve("bruh");
        });
        myP.then(
          () => {
            console.log("render krdia after adding");
            List.findOne({ name: customListName }, (err, foundList) => {
              res.render("list", {
                today: foundList.name,
                items: foundList.items,
              });
            });
          },
          () => {}
        );
      }
    });
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/", function (req, res) {
  let thing = req.body.newItem;
  let listName = req.body.list;
  thing = thing.trim();
  if (thing != "") {
    const item = new Item({
      name: thing,
    });
    if (listName == date()) {
      item.save();
      res.redirect("/");
    } else {
      List.findOne({ name: listName }, (err, foundList) => {
        foundList.items.push({name : thing});
        foundList.save();
        res.redirect("/" + listName);
      });
    }
  }
});

app.post("/delete", (req, res) => {
  Item.deleteOne({ _id: req.body.checkbox }, (err) => {
    if (err) {
      console.log("vsad");
    } else {
      setTimeout(() => {
        res.redirect("/");
      }, 500);
    }
  });
});

app.listen(3000, function () {
  console.log("server started!");
});
