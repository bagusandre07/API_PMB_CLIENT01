const mysql = require('mysql2')

var connectdb = mysql.createConnection({
    host:"yourhost",
    user:"user",
    password:"somepass",
database:"somedb",

});
connectdb.connect((err)=>{
    if (!err) {
        console.log("Database connected");
    }else{
        console.log(err);
    }
});

module.exports = connectdb;
