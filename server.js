const http = require('http');
const app = require('./index')
process.env.TZ = 'Asia/Jakarta'; 
port = 3000;
const server = http.createServer(app);
server.listen(process.env.PORT || port,() =>{
    console.log('server starting')
})

