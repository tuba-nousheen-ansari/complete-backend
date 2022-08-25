const jwt = require('jsonwebtoken');
exports.verifyToken = (request,response,next)=>{
 try{   
  if(!request.headers.authorization)
   return response.status(401).send("Unauthorized Request");
  if(request.headers.authorization == null)
   return response.status(401).send("Unauthorized Request");
    
  let token = request.headers.authorization.split(" ")[1];
  console.log(token);
  let payload = jwt.verify(token,"fdfdvcvrerejljjjjl");
  next();
 }
 catch(err){
   console.log(err);  
   return response.status(401).send("Unauthorized Request");
 }
}