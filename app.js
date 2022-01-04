
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { lowerCase } = require("lodash");
const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.CLUSTER_URL);

const homeStartingContent =
  "All your posts appear here.";
const aboutContent =
  "For the love of journaling ❤. This app was built on nodeJS with an express server and MongoDB.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title: String,
  content: String  
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {

  Post.find({}, function(err,posts){
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: posts
    });
  })
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postId", function(req,res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err,post){
    res.render("post",{
      title: post.title,
      content: post.content
    })
  })
    
})

app.post("/compose", function (req, res) {
  const homePostTitle = _.capitalize(req.body.titleText);
  const formatTitle = _.startCase(homePostTitle);
  const post = new Post({
    title: formatTitle,
    content: req.body.composeText
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}

app.listen(port, function () {
  console.log("Server started on port " + port);
});
