const express = require('express');
const router = express.Router();
const {body,validationResult} = require('express-validator');
const Category = require('../model/category');
const multer = require('multer');
const admin = require('../firebase-initializer');
const path = require('path');
const task = require('../middleware/token-verification');
var storage = multer.diskStorage(
    {
        destination: 'public/images',
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        }
    }
);
var upload = multer({ storage: storage });

router.get('/category-list',task.verifyToken,(request,response)=>{
   Category.find().then(result=>{
       return response.status(200).json(result);
   }).catch(err=>{
       return response.status(500).json({message: 'Internal Server Error'});
   });
});
router.post("/add-category",task.verifyToken,upload.single('categoryImage'),body('categoryName'),async (request,response) =>{
   const errors = validationResult(request);
   console.log('called....');
   if(!errors.isEmpty())
     return response.status(401).json({errors: errors.array()});
    let bucket = admin.storage().bucket();
    let filename = path.join(__dirname,'../','public/images/'+request.file.filename);
    await bucket.upload(filename,{
        gzip: true,
        metadata:{
            metadata: {
              firebaseStorageDownloadTokens: 'access-token'
            }
          }
    });
    let imageUrl = "https://firebasestorage.googleapis.com/v0/b/product-inventory-94396.appspot.com/o/"+request.file.filename+"?alt=media&token=access-token";
    Category.create({
        categoryName: request.body.categoryName,
        categoryImageUrl: imageUrl
    }).then(result=>{
        return response.status(201).json(result);
    })
    .catch(err=>{
        console.log(err);
        return response.status(500).json({message: 'Internal Server Error'});
    });
});
module.exports = router;