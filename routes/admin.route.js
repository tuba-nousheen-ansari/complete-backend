const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Admin = require("../model/admin");
router.post('/signup',
 body('username').notEmpty(),
 body('email').notEmpty(),
 body('password').notEmpty(),
 body('password').isLength(5),(request,response)=>{
  const errors = validationResult(request);
  if(!errors.isEmpty())
    return response.status(401).json({errors: errors.array()});
  Admin.create(request.body)
  .then(result=>{
    return response.status(201).json(result);
  })
  .catch(err=>{
    console.log(err);  
    return response.status(500).json({message: 'Internal Server Error'});
  });  
});
router.post("/signin",
 body('email').isEmail(),
 body('password').isLength(5),(request,response)=>{
    const errors = validationResult(request);
    if(!errors.isEmpty())
      return response.status(401).json({errors: errors.array()});
    Admin.findOne({email: request.body.email,password: request.body.password})
    .then(result=>{
      if(result){
        console.log(result);  
        let payload = {subject: result._id};
        let token = jwt.sign(payload,'fdfdvcvrerejljjjjl');
        return response.status(200).json({result: result, token: token, role: 'admin'});
      }
      return response.status(401).json({message: 'Invalid User'});  
    })
    .catch(err=>{
        return response.status(500).json({message: 'Internal Server Error'});
    });
});
module.exports = router;