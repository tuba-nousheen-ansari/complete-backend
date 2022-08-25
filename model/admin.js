const mongoose = require('mongoose');
const adminSchema  = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    username:{
        type: String,
        require: true
    }
});
module.exports = mongoose.model("admin",adminSchema);