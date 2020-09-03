//packages
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const helmet = require('helmet');
const routerSauce = require('./routes/sauces');
const routerUser = require('./routes/user');

const Cookiesession = require('cookie-session');

//cookies

expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(
  Cookiesession({
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'example.com',
      path: 'foo/bar',
      expires: expiryDate,
    },
  })
);

/// accéder à notre API depuis n'importe quelle origine
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(bodyParser.json());
app.use(helmet());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', routerUser);
app.use('/api/sauces', routerSauce);

module.exports = app;
