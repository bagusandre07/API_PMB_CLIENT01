const express = require('express');
 const router = express.Router();
 var format = require('date-format');
 router.get('/', (req, res) => {
    var datenow = format.asString('yy-MM-dd hh:mm:ss UTC +07:00', new Date());
    var expired =  new Date(Date.now() + 3600000)
    var datetime =  new Date(Date.now())

        return res.status(200).json({status:"200",developer:"Bagus Andre wijaya",date:datenow})

   
 });

 module.exports = router;