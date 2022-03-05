const express = require('express');
var cookieParser = require('cookie-parser');
const path = require("path");
const app = express();

if(process.env.NODE_ENV !== "production"){

    require("dotenv").config({path:"backend/config/config.env"});
}

//Using Middlewares
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb',extended:true}));
app.use(cookieParser());
//Importing Routes
const  post  = require('./routes/post'); //from routes folder post.js
const  user  = require('./routes/user'); 

//Using Routes
app.use("/api/v1",post); //localhost:3000/api/v1/post/upload
app.use("/api/v1",user);//localhost:3000/api/v1/register

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

module.exports=app;

