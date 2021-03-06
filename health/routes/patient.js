var express = require('express');
var router = express.Router();
var email=require('emailjs/email');

var Doctor=require('../models/doctors');
var Patient = require('../models/patients');
var Hospital = require('../models/hospital');
var randomstring = require("randomstring");

/* GET users listing. */

router.get('/patient_home', function(req, res) {
  if(req.session.patient)
  res.render('patient_home',{
    users:'1'
  });
  else res.redirect('/patient/login');
});



router.post('/login',function(req,res){
  Patient.getPatientByUsername(req.body.username,function(err,user){
    if(!user){
      res.json({"errorcode":1})
    } 
    else{
        Patient.comparePassword(req.body.password, user.password, function(err, isMatch){
      
        if(!isMatch){
          res.json({"errorcode":1})
        }
        if(isMatch){
          delete user.password;
          req.session.doctor=null;
          req.session.admin=null;
          req.session.patient = user;
          
          res.json({"errorcode":0})
        
      }
        
      }
  )}
})
});

router.post('/update_password',function(req,res){

  Patient.updatePassword(req.session.patient._id,req.body.password1,function(err,user){
    if(!user){
      console.log('error');
    }
    else{
      //res.redirect('/doctor/login');
    }

  })


});


router.get('/getHospitalData', function(req, res) {

    Hospital.getHospitalDatas(function(err,datas){
    if(err){

    }
  
    res.json(datas);
  });

  
});

router.post('/checkPassword', function(req, res) {
//console.log(req.body.currentPassword);
    Patient.comparePassword(req.body.currentPassword,req.session.patient.password,function(err,datas){
    if(!datas){
      //console.log("not matched");
      res.json({"errorCode":0});
    }
else{
  //console.log("matched");
  res.json({"errorCode":1});
}  
  });

  
});


router.post('/checkEmail', function(req, res) {
var email=[];
Doctor.getDoctorUserName(function(err,data){

if(data){
  var doctorData=data;
  //console.log(doctorData);
  for(i=0;i<doctorData.length;i++){
    //console.log(doctorData[i].username);
    var item={
    email:doctorData[i].email
     }
     //console.log(item);
     email.push(item);
  }
  //console.log(data);
}

Patient.getEntireData(function(err,user){
var result;
if(user){
    var patientData=user;
    //console.log(patientData);
    for(i=0;i<patientData.length;i++){
      //console.log(patientData[i].username);
      var item={
      email:patientData[i].email
      }
       email.push(item);
    }


    for(i=0;i<email.length;i++){
      if(email[i].email===req.body.email)
      {
        var result=1;
        break;
      }
      else{
        var result=0;
      }
    
    }
    
  }
res.json({"errorCode":result});

}); 
});
});

router.get('/forgetpassword',function(req,res){
res.render('forgetpassword');
});

router.post('/sendEmail',function(req,res){
  var newpassword =randomstring.generate(7);
  console.log(newpassword);
 
  Patient.setNewPassword(req.body.email,newpassword,function(err,user){
    if(!user){
      console.log('error');
    }
    else{
      
      var server  = email.server.connect({
                                 user:    "smarthealthcaresystem@gmail.com", 
                                 password:"12345!@#$%aA", 
                                 host:    "smtp.gmail.com", 
                                 ssl:     true
                              });

                                /** outlook configuration
                                  var server  = email.server.connect({
                                 user:    "username", 
                                 password:"password", 
                                 host:    "smtp-mail.outlook.com", 
                                 tls: {ciphers: "SSLv3"}
                              });
                                **/
                                //console.log(data);
                              
                                  
                                var msg="<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width'><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><title>Appraisal</title><style type='text/css'>@media only screen and (max-width: 620px) {table[class=body] h1 {font-size: 28px !important;table[class=body] p,table[class=body] ul,table[class=body] ol,table[class=body] td,table[class=body] span,table[class=body] a {font-size: 16px !important; table[class=body] .wrapper,table[class=body] .article {padding: 10px !important; }table[class=body] .content {padding: 0 !important; }table[class=body] .container {padding: 0 !important;width: 100% !important; }table[class=body] .main {border-left-width: 0 !important;border-radius: 0 !important;border-right-width: 0 !important; }table[class=body] .btn table {width: 100% !important; }table[class=body] .btn a {width: 100% !important; }table[class=body] .img-responsive {height: auto !important;max-width: 100% !important;width: auto !important; }}@media all {.ExternalClass {width: 100%; }.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {line-height: 100%; }.apple-link a {color: inherit !important;font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height: inherit !important;text-decoration: none !important; }.btn-primary table td:hover {background-color: #34495e !important; }.btn-primary a:hover {background-color: #34495e !important;border-color: #34495e !important; } }</style></head><body class='' style='background-color:#f6f6f6;font-family:sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.4;margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;'><table border='0' cellpadding='0' cellspacing='0' class='body' style='border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#f6f6f6;width:100%;'><tr><td style='font-family:sans-serif;font-size:14px;vertical-align:top;'>&nbsp;</td><td class='container' style='font-family:sans-serif;font-size:14px;vertical-align:top;display:block;max-width:580px;padding:10px;width:580px;Margin:0 auto !important;'><div class='content' style='box-sizing:border-box;display:block;Margin:0 auto;max-width:580px;padding:10px;'><!-- START CENTERED WHITE CONTAINER --><span class='preheader' style='color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;visibility:hidden;width:0;'>This is preheader text. Some clients will show this text as a preview.</span><table class='main' style='border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;background:#fff;border-radius:3px;width:100%;'><tr><td class='wrapper' style='font-family:sans-serif;font-size:14px;vertical-align:top;box-sizing:border-box;padding:20px;'><table border='0' cellpadding='0' cellspacing='0' style='border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%;'><tr><td style='font-family:sans-serif;font-size:14px;vertical-align:top;'><p style='font-family:sans-serif;font-size:14px;font-weight:normal;margin:0;Margin-bottom:15px;'></p><p style='font-family:sans-serif;font-size:14px;font-weight:normal;margin:0;Margin-bottom:15px;'>Your new password is"+" "+newpassword+"</b></p><table border='0' cellpadding='0' cellspacing='0' class='btn btn-primary' style='border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;box-sizing:border-box;width:100%;'><tbody><tr><td align='left' style='font-family:sans-serif;font-size:14px;vertical-align:top;padding-bottom:15px;'><center><table border='0' cellpadding='0' cellspacing='0' style='border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%;width:auto;'><tbody><tr><td style='font-family:sans-serif;font-size:14px;vertical-align:top;background-color:#ffffff;border-radius:5px;text-align:center;background-color:;'></td></tr></tbody></table></center></td></tr></tbody></table><p style='font-family:sans-serif;font-size:14px;font-weight:normal;margin:0;Margin-bottom:15px;'><center><b></b></center></p><p style='font-family:sans-serif;font-size:14px;font-weight:normal;margin:0;Margin-bottom:15px;'>Have a Good Day!.</p></td></tr></table></td></tr></table><!-- START FOOTER --><div class='footer' style='clear:both;padding-top:10px;text-align:center;width:100%;'><table border='0' cellpadding='0' cellspacing='0' style='border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%;'><tr><td class='content-block' style='font-family:sans-serif;font-size:14px;vertical-align:top;color:#999999;font-size:12px;text-align:center;'><span class='apple-link' style='color:#999999;font-size:12px;text-align:center;'>Smart Health Care</span><br>This email is system generated, please do not respond to this email.</td></tr><tr><td class='content-block powered-by' style='font-family:sans-serif;font-size:14px;vertical-align:top;color:#999999;font-size:12px;text-align:center;'>Powered by <a href='http://thub.ac.edu.in' style='color:#3498db;text-decoration:underline;color:#999999;font-size:12px;text-align:center;text-decoration:none;'>Smart SmartHealthCare </a>.</td></tr></table></div><!-- END FOOTER --><!-- END CENTERED WHITE CONTAINER --></div></td><td style='font-family:sans-serif;font-size:14px;vertical-align:top;'>&nbsp;</td></tr></table></body></html>";

                                //console.log(qrdata);
                                  
                              var message = {
                                 text:    msg, 
                                 from:    "SmartHealthCare<smarthealthcaresystem@gmial.com>", 
                                 to:      "bhagatd800@gmail.com",  // change mail for faculty
                                 cc:      "",
                                 subject: "New password",
                                 attachment: 
                                 [
                                    {data:msg, alternative:true},
                                    //attachment
                                    //{path:"C:/Users/Admin/Desktop/file/rj.html", type:"application/html", name:"rj.html"}
                                    
                                 ]
                              };

                              // send the message and get a callback with an error or details of the message that was sent
                              server.send(message, function(err, message) { 
                              if(err)
                              {
                              console.log("error");
                              res.json({"errorCode":0});
                              }
                              if(message){
                                console.log("no error")};
                                res.json({"errorCode":1});

                               });
                              
                    
       }
       


  })


});  


router.post('/updateProfile',function(req,res){
  Patient.updateProfile(req.session.patient._id,req.body, function(err,user){
    if(err){
      res.json({"errorcode":0})
    }
    else{
      res.json({"errorcode":1})
    }

  })
  
});


router.get('/getProfile', function(req, res) {

    Patient.getProfiles(req.session.patient._id,function(err,datas){
    if(err){

    }
  
    res.json(datas);
  });

  
});


module.exports = router;
