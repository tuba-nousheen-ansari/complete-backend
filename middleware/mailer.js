const nodemailer = require('nodemailer');
exports.sendEmail = (username,email,password)=>{
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
          user: 'puru.sahu.27.12@gmail.com',
          pass: 'puru@2712'
      }
  });
  let mailOptions = {
      from: 'puru.sahu.27.12@gmail.com',
      to: email,
      subject: 'Stationery On Door',
      html: '<p>Dear '+username+'</p><h2>Thank you registration</h2>'+
      '<p>Your login credential</p>'+
      'Usename : '+email+'<br>Password :'+password+
      '<h4>Thanks & Regards</h4>'+
      '<h3>Team : Stationery On Door</h3>'
  }
  transporter.sendMail(mailOptions,(err,info)=>{
      if(err){
        console.log(err);
        return response.status(400).json({error: 'Email not sent'});
      }
      else
       next();
  })
}