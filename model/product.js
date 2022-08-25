const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    productName:{
        type: String,
        required: true
    },
    productPrice:{
        type: Number,
        required: true
    },
    productDiscount:{
        type: Number,
        required: true
    },
    productDescription:{
        type: String,
        required: true
    },
    productImageUrl:{
        type: String,
        required: true
    }
});
module.exports = mongoose.model("product",productSchema);