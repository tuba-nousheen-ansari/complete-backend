const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    categoryName:{
        type: String,
        required: true,
        unique: true
    },
    categoryImageUrl:{
        type:String,
        required: true
    }
});

module.exports = mongoose.model('category',categorySchema);