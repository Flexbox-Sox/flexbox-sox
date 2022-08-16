// This is the Web Server
const express = require('express');
const server = express();
require("dotenv").config();
const cors = require('cors');
server.use(cors());
const morgan = require('morgan');
server.use(morgan('dev'));
server.use(express.json());
const session = require('express-session');

server.use(
  session({
    secret: `${process.env.JWT_SECRET}`,
    resave: false,
    saveUninitialized: false
  })
);


// server.get('/', (req, res) => {
//   console.log(req.session);
//   console.log("session id ", req.sessionID)
//   req.session.viewCount += 1;
//   res.send(`View count at ${req.session.viewCount}`);
// })

// here's our static files
const path = require('path');
server.use(express.static(path.join(__dirname, 'build')));


// here's our API
server.use('/api', require('./api'));


// by default serve up the react app if we don't recognize the route
server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// bring in the DB connection
const { client } = require('./db');
const { appendFile } = require('fs');

// connect to the server
const PORT = process.env.PORT || 4000;

// define a server handle to close open tcp connection after unit tests have run
const handle = server.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}!`);

  try {
    await client.connect();
    console.log('Database is open for business!');
  } catch (error) {
    console.error('Database is closed for repairs!\n', error);
  }
});

// export server and handle for routes/*.test.js
module.exports = { server, handle };
