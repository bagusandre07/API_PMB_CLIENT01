const express = require('express');
const router = express.Router();
const database = require('../middleware/database');
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const jwt = require('jsonwebtoken')
const dateformat = require('date-format')

var transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
        user: "wijayabagusandre@gmail.com",
        pass: "wgvdaofizafoockl",
    }
});

const handlebarsOption = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./views'),
        defaultLayout: false


    },
    viewPath: path.resolve('./views'),
    extName: '.handlebars',
}

transporter.use('compile', hbs(handlebarsOption));


router.post('/register', (req, res) => {
    var params = req.query;
    const otp = `${Math.floor(1000 + Math.random() * 60000)}`;
    var otpsend = otp;
    var query = "insert into users(username,password,status) values(?,?,0)";
    var query2 = "insert into code(username,code,expired) values(?,?,?)";
    var expired = new Date(Date.now() + 300000)
    database.query(query, [params.username, params.password], (err, result) => {
        if (!err) {
            try {
                database.query(query2, [params.username, otpsend, expired], (err, result) => {
                    if (!err) {
                        try {
                            var mailoption = {
                                from: "SAMPLESENDER <noreply.wijayabagusandre@gmail.com>",
                                to: params.username,
                                subject: "BagusAndreWijaya-NoReply",
                                template: "email",
                                context: {
                                    kode: otp,
                                    name: params.username
                                }
                            };
                            transporter.sendMail(mailoption, function (error, info) {
                                if (error) {
                                    console.log(error)
                                } else {
                                    console.log("sukses kirim")
                                    res.status(200).json({ status: "true", message: "succesfully registered", description: "we have sent a verification code to your gmail please check your gmail or spam email, the activation code will expire in 4 minutes" });
                                }
                            })
                        } catch (error) {
                            console.log(error)
                        }


                    } else {
                        console.log(err)
                    }
                })
            } catch (error) {
                console.log(error)
            }


        } else {
            res.status(409).json({ status: "true", message: "already registered" });
        }
    })
});




    

router.post('/login', (req, res) => {
    var params = req.query;
    var querys = "select * from users where username=? and password=?";
    database.query(querys, [params.username, params.password], (err, rows) => {
        if (!err) {
            if (rows.length != 0) {
                if (rows[0].status != "0") {
                    res.status(200).json({ status: true, message: "loggedin" })
                } else {
                    res.status(403).json({ status: false, message: "your account isn't activated please verification your email for tell me who you are" })
                }
            } else {
                res.status(404).json({ status: false, message: "cant find your account" })

            }
        } else {
            res.send(err);
        }
    });



});



router.post('/generate', (req, res) => {
    const otp = `${Math.floor(1000 + Math.random() * 60000)}`;
    var otpnew = otp;
    var expired = new Date(Date.now() + 300000)
    var params = req.query;
    var query2 = "insert into code(username,code,expired) values(?,?,?)";
    database.query(query2, [params.email, otpnew, expired], (err, rows) => {
        if (!err) {
            res.status(200).json({ status: 200, message: "new code generated check your email" })
        } else {
            res.status(401).json(res)
        }
    })



});

router.delete('/deleteotp', (req, res) => {
    var query2 = "delete from code where username=?";

    var params = req.query;
    database.query(query2, [params.email], (err, rows) => {
        if (!err) {
            res.status(200).json({ status: 200, message: "succesfully deleted" })
        }
    })

});

module.exports = router;    