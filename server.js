const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const methodOverride = require("method-override");
const helmet = require(helmet);
const app = express();

app.set("view engine", "ejs");

app.use(helmet())
app.use("/public", express.static(process.cwd() + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  MongoClient.connect(
    "mongodb+srv://advancednodedb:a@cluster0.casky.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        res.sendFile(process.cwd() + "/views/error.html");
      } else {
        client
          .db("test")
          .collection("article")
          .find({})
          .sort({ "created": -1 })
          .toArray(function (err, result) {
            if (err) throw err;
            res.render("./index", { result: result });
          });
      }
    }
  );
});
app.get("/article/:id", (req, res) => {
  const { id } = req.params;
  MongoClient.connect(
    "mongodb+srv://advancednodedb:a@cluster0.casky.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        res.sendFile(process.cwd() + "/views/error.html");
      } else {
        client
          .db("test")
          .collection("article")
          .findOne({ _id: new ObjectId(id) }, (err, doc) => {
            if (err) {
              res.sendFile(process.cwd() + "/views/error.html");
            } else {
              res.render("./articles", { doc: doc });
            }
          });
      }
    }
  );
});
app.get("/admin", (req, res) => {
  MongoClient.connect(
    "mongodb+srv://advancednodedb:a@cluster0.casky.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        res.sendFile(process.cwd() + "/views/error.html");
      } else {
        client
          .db("test")
          .collection("article")
          .find({})
          .sort({ "created": -1 })
          .toArray(function (err, result) {
            if (err) throw err;
            res.render("./admin/admin", { result: result });
          });
      }
    }
  );
});
app.get("/admin/article/:id", (req, res) => {
  const { id } = req.params;
  MongoClient.connect(
    "mongodb+srv://advancednodedb:a@cluster0.casky.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        res.sendFile(process.cwd() + "/views/error.html");
      } else {
        client
          .db("test")
          .collection("article")
          .findOne({ _id: new ObjectId(id) }, (err, doc) => {
            if (err) {
              res.sendFile(process.cwd() + "/views/error.html");
            } else {
              res.render("./admin/preview", { doc: doc });
            }
          });
      }
    }
  );
});
app.get("/admin/article/edit/:id", (req, res) => {
  const { id } = req.params;
  MongoClient.connect(
    "mongodb+srv://advancednodedb:a@cluster0.casky.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        res.sendFile(process.cwd() + "/views/error.html");
      } else {
        client
          .db("test")
          .collection("article")
          .findOne({ _id: new ObjectId(id) }, (err, doc) => {
            if (err) {
              res.sendFile(process.cwd() + "/views/error.html");
            } else {
              res.render("./admin/edit", { article: doc });
            }
          });
      }
    }
  );
});
app.put("/admin/articles/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, article, tags } = req.body;
  const newUpdated = {
    title,
    description,
    article,
    tags: tags.split(","),
    updated: Date.now(),
  };
  MongoClient.connect(
    "mongodb+srv://advancednodedb:a@cluster0.casky.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        res.sendFile(process.cwd() + "/views/error.html");
      } else {
        client
          .db("test")
          .collection("article")
          .findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: newUpdated },
            { returnOriginal: false },
            function (err, doc) {
              !err
                ? res.render("./admin/preview", { doc: doc.value })
                : res.sendFile(process.cwd() + "/views/error.html");
            }
          );
      }
    }
  );
});
app.delete("/admin/article/:id", (req, res) => {
  const { id } = req.params;
  MongoClient.connect(
    "mongodb+srv://advancednodedb:a@cluster0.casky.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        res.sendFile(process.cwd() + "/views/error.html");
      } else {
        client
          .db("test")
          .collection("article")
          .findOneAndDelete({ _id: new ObjectId(id) }, function (err, doc) {
            !err
              ? res.redirect("/admin")
              : res.sendFile(process.cwd() + "/views/error.html");
          });
      }
    }
  );
});
app.get("/admin/new", (req, res) => {
  res.render("./admin/new");
});
app.post("/admin/new/post", (req, res) => {
  const { title, description, article, tags } = req.body;
  const newArticle = {
    title,
    description,
    article,
    tags: tags.split(","),
    created: Date.now(),
    updated: Date.now(),
  };
  MongoClient.connect(
    "mongodb+srv://advancednodedb:a@cluster0.casky.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        res.sendFile(process.cwd() + "/views/error.html");
      } else {
        console.log("successful database connection");
        client
          .db("test")
          .collection("article")
          .insertOne(newArticle, (err, doc) => {
            if (err) {
              res.sendFile(process.cwd() + "/views/error.html");
            } else {
              console.log(doc.ops[0]);
              res.render("./admin/preview", { doc: doc.ops[0] });
            }
          });
      }
    }
  );
});
app.get("/admin/preview", (req, res) => {
  res.sendFile(process.cwd() + "/views/preview.ejs");
});

app.listen(5000);
