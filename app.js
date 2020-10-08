const express = require('express');
const mongoose = require('mongoose');
const mongo = require('./config/database');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//Set pages
const pages = require('./routes/pages.js');

//    *************
//    Connect to db
//    **************

mongoose.connect(mongo.database,{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'))
db.once('open',()=>{
    console.log('connected to mongodb');
})
//    ****************
//    Initializing app
//    **************** 
const app = express();
const path = require('path');

//setting paths for public,views & partials
const publicDirPath = path.join(__dirname,'/public');
const viewPath = path.join(__dirname,'/views');

//setting up template

const port = 3000;




//    *******************
//    M I D D L E W A R E
//    *******************

//Body Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())



//Public dir path set
app.use(express.static(publicDirPath));

//Setting Pages Router
app.use('/',pages);


//cookie parser
app.use(cookieParser('keyboard cat'));

//Express-Sessions




// ##############
//  Setting Path
// ##############


//setting views path
 app.set('views',viewPath);


//setting view engine
app.set('view engine','ejs');






app.listen(port,()=>{
    console.log('website is working!!');
})

