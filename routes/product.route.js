const express = require('express');
const router = express.Router();
const task = require('../middleware/token-verification');
const multer = require('multer');
const path = require('path');
const Product = require('../model/product');
const { body, validationResult } = require('express-validator');
const admin = require('../firebase-initializer');
var storage = multer.diskStorage(
    {
        destination: 'public/images',
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        }
    }
);
var upload = multer({ storage: storage });

router.get('/category-product/:cid',task.verifyToken,(request,response)=>{
   Product.find({categoryId: request.params.cid})
   .then(result=>{
      return response.status(200).json(result);
   }).catch(err=>{
      return response.status(500).json({message: 'internal server error'});
   })
});
router.get('/product-list',task.verifyToken,(request,response)=>{
  Product.find().then(results=>{
      return response.status(200).json(results);
  }).catch(err=>{
      return response.status(500).json({message: 'Internal Server Error'});
  });
});
router.get("/search-product/:text",(request,response)=>{
  let regex = new RegExp(request.params.text,"i");
  Product.find().or([
    {
      productName: regex,
    },
    {
      productDescription: regex
    },
    {
      productDescription: regex
    }
  
  ]).then(result=>{
    return response.status(200).json(result);
  })
  .catch(err=>{
    console.log(err);
    return response.status(500).json({message: 'Error..'});
  })
});
router.post("/add-product",task.verifyToken,upload.single('productImage'),
 body('categoryId').notEmpty(),
 body('productName').notEmpty(),
 body('productPrice').notEmpty(),
 body('productPrice').isNumeric(),
 body('productDiscount').isNumeric(),
 body('productDescription').notEmpty(),
 async (request,response)=>{
   console.log("Product Route called...");  
   const errors = await validationResult(request);
   if(!errors.isEmpty())
     return response.status(401).json({message: 'Bad Request'});
   
   let bucket = await admin.storage().bucket();
   let filename = await path.join(__dirname,'../','public/images/'+request.file.filename);
   await bucket.upload(filename,{
    gzip: true,
    metadata:{
        metadata: {
          firebaseStorageDownloadTokens: 'access-token'
        }
      }
    }); 
    let imageUrl = "https://firebasestorage.googleapis.com/v0/b/product-inventory-94396.appspot.com/o/"+request.file.filename+"?alt=media&token=access-token";
    request.body.productImageUrl = imageUrl;
    Product.create(request.body).then(result=>{
        return response.status(201).json(result);
    }).catch(err=>{
        console.log(err);
        return response.status(500).json({message: 'Internal Server Error'});
    });
});

module.exports = router;