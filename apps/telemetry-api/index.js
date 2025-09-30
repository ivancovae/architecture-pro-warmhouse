const express = require('express');
const process = require('node:process');
const http = require('http');

const app = express();
const router = express.Router();

const path = __dirname;
const port = process.argv[2];


TEMPERATURE_API_URL = process.argv[3];
console.log("TEMPERATURE_API_URL="+TEMPERATURE_API_URL);

router.use((req,res,next) => {
  console.log('/' + req.method);
  next();
});

const needSended = [];
global.Sensors = {};

router.get(`/api/device/:id/start`, (req,res) => {
  const id = req.params.id;
  if (needSended.indexOf(id) == -1) {
    needSended.push(id);
  }
  console.log('id=' + id);
  Sensors[id] = []
  
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

  const values = Sensors[id];
  let result = 0;
  for (let i = 0; i < values.length; i++) {
    result += values[i];
  }
  let average = result/values.length;
  console.log('averange=' + average);
  res.send(JSON.stringify({average: average}));
});

router.get('/', (req,res) => {
  res.send('Service monitoring values');
});

app.use('/', router);

const updateValues = async (el) => {
  const url = `${TEMPERATURE_API_URL}/api/v1/sensors/${el}`;
  console.log(url);

  var req = http.get(url, (res) => {
    console.log('STATUS: ' + res.statusCode);
    let output = '';
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      output += chunk;
    });

    res.on('end', () => {
      try {
        let data = JSON.parse(output);
        Sensors[el].push(data.value)
      }
      catch (err) {
        console.error('end', err);
      }
    });

  });
  req.on('error', function(e) {
    console.log('ERROR: ' + e.message);
  });
  req.end();
}

app.listen(port, () => {
  console.log('Listening on port 8082')

  setInterval(()=>{
    for(let i = 0; i < needSended.length; i++) {
      updateValues(needSended[i]);
    }
  }, 1000)
})