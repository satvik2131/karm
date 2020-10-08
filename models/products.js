const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    userId:{
        required:true
    },
    product_name:{
        required:true
    },
    Date:{
        required:true
    },
    Address:{
        required:true
    },
    
})