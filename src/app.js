const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
const cors = require('cors');
const { expressjwt: jwt } = require("express-jwt");

const routesClient = require('./routes/routesClient');
const routesUser = require('./routes/routesUser');
const routesEmployees = require('./routes/routesEmployee');

//Initializations
const app = express();

//Settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use(
    jwt({
      secret: config.ACCESS_TOKEN_SECRET,
      algorithms: ['HS256'],
    }).unless(function (req) {
      var routeUpdate= '/api/user/:id';
      var routerMatcher = new RegExp(routeUpdate.replace(/:[^\s/]+/g, '([\\w-]+)'));
      var url = req.originalUrl;
      var result = url.match(routerMatcher);
      var invalidRoutes = [];
      if(result !== null){
        invalidRoutes = [
          '/',
          '/api/refresh-token',
          '/api/login',
          result.input,
        ];
      }
      else{
         invalidRoutes = [
          '/',
          '/api/refresh-token', 
          '/api/login',
        ];
      }
  
      if (invalidRoutes.includes(req.originalUrl)) {
        return true;
      }
  
      return invalidRoutes.some((route) => {
        const [method, originalUrl] = route.split(' ');
  
        return method === req.method && originalUrl === req.originalUrl ? true : false;
      });
    }),
);


//Routes User
app.use('/api', routesUser);
app.use('/api', routesEmployees);
app.use('/api', routesClient);


//middleware
app.use(function (err, _req, res, _next) {
    res.status(err.status_code || 500).json({
        error: {...err, message: err.message, stack: err.stack},
    });
});


//Starting the server
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
