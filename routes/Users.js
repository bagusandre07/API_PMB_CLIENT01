const express = require('express');
const router = express.Router();
const database = require('../middleware/database');
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const jwt = require('jsonwebtoken')
const dateformat = require('date-format')

var transporter = nodemailer.createTransport({
    service:"gmail",
    host:'smtp.gmail.com',
    secure:false,
    auth:{
        user:"wijayabagusandre@gmail.com",
        pass:"wgvdaofizafoockl",
    }
});

const handlebarsOption = {
    viewEngine:{
        extName:'.handlebars',
        partialsDir: path.resolve('./views'),
        defaultLayout:false


    },
    viewPath: path.resolve('./views'),
    extName:'.handlebars',
}

transporter.use('compile',hbs(handlebarsOption));


router.post('/register', (req, res) => {
var params = req.query;
const otp = `${Math.floor(1000 + Math.random() * 60000)}`
var otpsend = otp;
var query = "insert into users(username,password,status) values(?,?,0)";
var query2 = "insert into code(username,code,expired) values(?,?,?)";
var expired = new   Date(Date.now() + 300000)
database.query(query,[params.username,params.password],(err,result)=>{
    if (!err) {
try {
    database.query(query2,[params.username,otpsend,expired],(err,result)=>{
        if (!err) {
           try {
            var mailoption  = {
                from:"AndreDevs <noreply.wijayabagusandre@gmail.com>",
                to:params.username,
                subject:"AndreDev-NoReply",
                template:"email",
                context:{
                    kode:otp,
                    name:params.username
                }
            };
            transporter.sendMail(mailoption,function(error,info){
                if (error) {
                    console.log(error)
                }else{
                    console.log("sukses kirim")
                    res.status(200).json({status:"true",message:"succesfully registered",description:"we have sent a verification code to your gmail please check your gmail or spam email, the activation code will expire in 4 minutes"});
                }
            })
           } catch (error) {
            console.log(error)
           }
    
    
        }else{
            console.log(err)
        }
    })
} catch (error) {
    console.log(error)
}

       
    }else{
        res.status(409).json({status:"true",message:"already registered"});
    }
})
});





router.get('/verify', (req, res) => {
    var params = req.query;
    var query = "Select * from code where code=?";
 var status = '1';
    database.query(query,[params.otp],(err,rows)=>{
      if (!err) {
        if (rows.length == 0) {
         
            res.status(401).json({status:"false",message:"Wrong Code"})
        }else{
        var expires = new Date(rows[0].expired) //menangkap salahsatu respon yang di return 
       
           let currentdate = new Date(Date.now())
           if (expires > currentdate)//compare expired dengan datenow
            {
                var username = rows[0].username;
              
            console.log(expires)
            var query2 = 'update users set status = ? where username = ?';
            database.query(query2,[status,username],(err,result)=>{
                if (!err) {
                    res.status(200).json({status:"true",message:"succesfully verify account lets get started"});
                }else{
                    res.status(401).json({status:"false",message:"code isn't valid if you think this anomaly system you can call service center for helping you"})
                }
            })
        
           }else{
            res.status(410).json({status:"false",message:"Verification Code Expired"});
            console.log(expires)
            console.log(currentdate)
           }
          
            
           
       
        }
      }
    })

});

router.post('/login', (req, res) => {
    var params = req.query;
    var querys = "select * from users where username=? and password=?";
     database.query(querys,[params.username,params.password],(err,rows)=>{
        if (!err) {
            if (rows.length != 0) {
                if (rows[0].status != "0") {
                    res.status(200).json({status:true,message:"loggedin"})
                }else{
                    res.status(403).json({status:false,message:"your account isn't activated please verification your email for tell me who you are"})
                }
            }else{
                res.status(404).json({status:false,message:"cant find your account"})
        
            }
        }else{
            res.send(err);
        }
     })


     

});
module.exports = router;    