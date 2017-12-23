var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var fs = require('fs');
var path = require("path");
var PORT = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var db = require("./models");

var PORT = 3000;

// Initialize Express


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongo-scraper", {
  useMongoClient: true
});

// Routes

app.get("/", function(req, res) {



   res.render("index");

});

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.espn.com/nba").then(function(response) {
    //node Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var results = [];
    // Now, we grab every h2 within an article tag, and do the following:
    $("section .contentItem__content").each(function(i, element) {
      // Save an empty result object
      
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find("h1")
        .text();
       result.sum = $(this)
        .find("p")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

        results.push(result);

         });

    var data = {

      daty: results
    }

 res.render("index", {data});

});
});



app.post("/save", function(req, res) {

  console.log(req.body.info.title);
    console.log(req.body.info.sum);
      console.log(req.body.info.link);

      db.Article
      .create({

      title: req.body.info.title,
      sum: req.body.info.sum,
      link: req.body.info.link

      }).then(function(result){

 res.end();


       }).catch(function(err) {
      // If an error occurred, send it to the client
      
      res.json(err);

    });

    });

app.post("/delete", function(req, res) {

  console.log(req.body.info.title);

      db.Article
      .remove({

      title: req.body.info.title

      }).then(function(result){

 res.end();


       }).catch(function(err) {
      // If an error occurred, send it to the client
      
      res.json(err);

    });

    });


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article
    .find({})
    .then(function(dbArticle) {
      
      console.log(dbArticle);

      res.render("articles", {dbArticle});
    })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
