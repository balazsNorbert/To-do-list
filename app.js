const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/todoDB",{family: 4});

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item ({
  name: "Welcome to your todolist!"
});

const item2 = new Item ({
  name: "Hit the + button to add a new item!"
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1,item2,item3];


app.get("/", function(req, res){
  const day = date.getDate();

  Item.find({},function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Succesfully saved default items to DB");
        }
    });
    res.redirect("/");
  }else{
      res.render("list",{listTitle: day,newListItems:foundItems});
  }
  });
});

app.post("/",function(req,res){
  const itemName = req.body.newItem;
  item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("Succesfully deleted checked it");
      res.redirect("/");
    }
  });
});

app.get("/work",function(req,res){
  res.render("list",{listTitle: "Work List",newListItems: workItems});
});

app.post("/work",function(req,res){
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

app.get("/about",function(req,res){
  res.render("about");
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
