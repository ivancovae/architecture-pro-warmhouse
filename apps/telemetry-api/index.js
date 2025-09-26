const express = require('express');
const process = require('node:process');

const app = express();
const router = express.Router();

const path = __dirname;
const port = process.argv[2];

TEMPERATURE_API_URL = process.argv[3];
console.log("TEMPERATURE_API_URL="+TEMPERATURE_API_URL);

router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.get('/', function(req,res){
  res.send('');
});

app.use('/', router);

app.listen(port, function () {
  console.log('Listening on port 8082')
})