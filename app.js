
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { lowerCase } = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/journalDB");

const homeStartingContent =
  "All your posts appear here";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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

// app.get("/contact", function (req, res) {
//   res.render("contact", { contactContent: contactContent });
// });

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
  const post = new Post({
    title: _.capitalize(req.body.titleText),
    content: req.body.composeText
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

});

app.listen(process.env.PORT||8080, function () {
  console.log("Server started on port 8080");
});
