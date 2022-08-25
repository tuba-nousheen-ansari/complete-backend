const express = require('express');
const router = express.Router();
const task  =require('../middleware/token-verification');
const Cart = require('../model/cart');
const mongoose = require('mongoose');
router.post("/add-to-cart",task.verifyToken,async (request,response)=>{
   let cart = await Cart.findOne({userId:request.body.userId});
   console.log(cart);
   if(cart){
       console.log('inside if');
       for(index in cart.cartItem){
           if(cart.cartItem[index].productId == request.body.productId)
           return response.status(200).json({message: 'Already added in cart'});
       }
       await cart.cartItem.push(request.body.productId)
       cart.save()
       .then(result=>{
           console.log(result);
           return response.status(201).json(result);
       })
       .catch(err=>{
           console.log(err);
           return response.status(500).json({message: 'Internal Server Error'});
       });
   }
   else{
       console.log("inside else..")
       let newCart = await new Cart();
       newCart.userId = await request.body.userId;
       await newCart.cartItem.push(request.body.productId);
       newCart.save()
       .then(result=>{
           console.log(result);
           return response.status(201).json(result);
       })
       .catch(err=>{
           console.log(err);
           return response.status(500).json({message: 'Internal Server Error'});
       });
   }
});
router.post("/cart-items",task.verifyToken,(request,response)=>{
    console.log("called......");
    Cart.find({userId: request.body.userId}).populate('cartItem')
    .then(result=>{
      console.log(result); 
      return response.status(200).json(result);
    })
    .catch(err=>{
       console.log(err);
       return response.status(500).json({message: 'Error..'});
    });
  });
  
module.exports = router;







