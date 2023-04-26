const express = require("express");

const app = express();
app.listen(3000);

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("home", { title: "home" });
});

app.get("/myBlogs", (req, res) => {
  res.render("myBlogs", { title: "Mine blogger" });
});

app.get("/veileder", (req, res) => {
  res.render("veileder", { title: "SSH veileder" });
});

app.get("/Max@bloggis.com", (req, res) => {
  res.render("max", { title: "Max sine blogger" });
});

app.get("/Johan@bloggis.com", (req, res) => {
  res.render("johan", { title: "Johan sine blogger" });
});