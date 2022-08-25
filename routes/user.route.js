const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult} = require('express-validator');
const User = require('../model/user');
const mailer = require('../middleware/mailer');

router.post("/verify-account",
body("email").notEmpty(),(request,response)=>{
   const errors = validationResult(request);
   if(!errors.isEmpty())
     return response.status(401).json({errors: errors.array()});
   User.updateOne({email: request.body.email},{isVarified: true})
   .then(result=>{
       console.log(result);
       return response.send("<h3 style='text-align: center;'>Account is successfully verified . Please login in application</h3>");
   })
   .catch(err=>{
       console.log(err);
       return response.status(500).json({message: 'Internal Server Error'});
   });  
});

router.post("/signup",body('username').notEmpty(),
 body('email').notEmpty(), async (request,response)=>{
   const errors = await validationResult(request);
   if(!errors.isEmpty())
     return response.status(401).json({errors: errors.array()});
    let password = await ""+Math.floor(100000 + Math.random() * 900000);
    request.body.password = password;
    User.create(request.body)
   .then(result=>{
       mailer.sendEmail(request.body.username,request.body.email,password);
       return response.status(201).json(result);
   })
   .catch(err=>{
      console.log(err); 
      return response.status(500).json({message: 'Internal Server Error'});
   });
 });
router.post("/signin",
  body('email').notEmpty(),
  body('password').notEmpty(),(request,response)=>{
   console.log(request.body);
  const errors = validationResult(request);
  if(!errors.isEmpty())
    return response.status(401).json({errors: errors.array()});
  delete request.body.username;
  User.findOne(request.body)
  .then(result=>{
      if(result){
       let payload = {subject: result._id};
       let token = jwt.sign(payload,'fdfdvcvrerejljjjjl');
       return response.status(200).json({result: result, token: token});
      }
      else
        return response.status(401).json({message: 'Bad Request..'}); 
  })
  .catch(err=>{
      console.log(err);
      return response.status(500).json({message: 'Internal Server Error'});
  });  
})
module.exports = router;