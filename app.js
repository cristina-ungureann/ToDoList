//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
let foundItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/toDoListDB", { useNewUrlParser: true });

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Finish Section 35"
});

const item2 = new Item({
  name: "Finish Section 36"
});

const item3 = new Item({
  name: "Go to gym"
});

const defaultItems = [item1, item2, item3];

async function getItems() {
  try {
    foundItems = await Item.find({});
    console.log(foundItems);
  } catch (error) {
    console.log(error);
  }
}



app.get("/", async function(req, res) {
  try {
    if (foundItems.length === 0) {
      await getItems();
      if (foundItems.length === 0) {
        await Item.insertMany(defaultItems);
        console.log("All items have been saved.");
        res.redirect("/");
      }
     
    }

    res.render("list", { listTitle: "Today", newListItems: foundItems });
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.connection.close();
  }
});








  

app.post("/", function(req, res) {
  const item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
