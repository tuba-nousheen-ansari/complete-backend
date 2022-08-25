const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    cartItem:[{type: mongoose.Schema.Types.ObjectId,ref: 'product'}]
    
});
module.exports = mongoose.model("cart",cartSchema);