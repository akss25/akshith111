const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
const configureSession = require('./app/middleware/session');
const setupPassport = require('./app/passport');
const setupSocketIO = require('./app/socket');


dotenv.config();


const PORT = process.env.PORT || 3000;
const application = express();
const server = createServer(application);
const socketServer = new Server(server);


application.set('views', path.resolve(__dirname, 'app/views'));
application.set('view engine', 'ejs');


application.use(configureSession);
application.use(express.urlencoded({ extended: false }));
application.use(express.static(path.resolve(__dirname, 'public')));


setupPassport(application);


application.use('/', require('./app/routes/index'));
application.use('/', require('./app/routes/auth'));


setupSocketIO(socketServer);


server.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});
