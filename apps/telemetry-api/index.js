const express = require('express');
const process = require('node:process');
const http = require('http');

const libDb = require('./dbManager.js');

const app = express();
const router = express.Router();

const path = __dirname;
const port = process.argv[2];


TEMPERATURE_API_URL = process.argv[3];
console.log("TEMPERATURE_API_URL="+TEMPERATURE_API_URL);

const db = new libDb.dbManager();

router.use((req,res,next) => {
  console.log('/' + req.method);
  next();
});

const needSended = [];

router.get(`/api/device/:id/start`, (req,res) => {
  const id = req.params.id;
  if (needSended.indexOf(id) == -1) {
    needSended.push(id);
  }
  console.log('id=' + id);
  
  console.log('start=' + id);
  res.send('');
});

router.get(`/api/device/:id/stop`, (req,res) =>{
  const id = req.params.id;
  console.log('id=' + id);
  var index = needSended.indexOf(id);
  if (index !== -1) {
    needSended.splice(index, 1);
  }
  console.log('stop=' + id);
  res.send('');
});

router.get(`/api/device/:id/average`, (req,res) =>{
  const id = req.params.id;
  console.log('id=' + id);

  let jsonData = JSON.stringify(db.getSensorById(id), null, 4);  
  console.log(jsonData);
  
  console.log('averange=' + id);
  res.send('');
});

router.get('/', (req,res) => {
  res.send('Service monitoring values');
});

app.use('/', router);

app.listen(port, () => {
  db.initialize();

  console.log('Listening on port 8082')

  setInterval(()=>{
    for(let i = 0; i < needSended.length; i++) {
      var el = needSended[i];
      console.log(el);
      const url = `${TEMPERATURE_API_URL}/api/v1/sensors/${el}`;
      console.log(url);
      http.get(
          url,
          null,
          (error, response, body) => {
              if (!error && (response.statusCode == 200)) {
                  console.log(body);
                  const json = JSON.parse(body);

                  db.createSensorValue({sensorId: el, value:json.value})
              } else {
                console.log(`=> error=${error}`);
              }
          }
      );
    }
  }, 1000)
})