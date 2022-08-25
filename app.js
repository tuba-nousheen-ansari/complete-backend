const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
mongoose.connect("mongodb+srv://mean:mean%23345@cluster0.dkefj.mongodb.net/complete_database?retryWrites=true&w=majority", err => {
    if (!err) {
        const adminRouter = require('./routes/admin.route');
        const categoryRouter = require('./routes/category.route');
        const path = require('path');
        const productRouter = require('./routes/product.route');
        const userRouter = require('./routes/user.route');
        const cartRouter = require('./routes/cart.route');
        app.use(express.static(path.join(__dirname,'public')));
        app.use(cors());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use("/admin", adminRouter);
        app.use("/category",categoryRouter);
        app.use("/product",productRouter);
        app.use("/user",userRouter);
        app.use("/cart",cartRouter);
        app.listen(3000,()=>{
            console.log('server running');
        });
    }
})