const http = require('http');
const app = require('./index')

port = 3000;
const server = http.createServer(app);
server.listen(process.env.port || port,() =>{
    console.log('server starting')
})

