const mongoose = require('mongoose');

//Page Schema
const Schema = mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    slug:{
        type: String,
    },
    content:{
        type: String,
        required:true
    },
    sorting:{
        type: Number
    },
});