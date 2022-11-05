const mysql = require('mysql2')

var connectdb = mysql.createConnection({
    host:"ap-southeast.connect.psdb.cloud",
    user:"65wpldvwt3m3l4qp9zci",
    password:"pscale_pw_bgnRx3mPAHZMKPdcznJ6jQuZNqRPq3n2s289Ed9dOGA",
database:"pmbsites",
    ssl:  {
    rejectUnauthorized: false
}
});
connectdb.connect((err)=>{
    if (!err) {
        console.log("Database connected");
    }else{
        console.log(err);
    }
});

module.exports = connectdb;