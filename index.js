const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs')
const jwt = require('jsonwebtoken');
const { nextTick } = require('process');

app.get('/', (req,res) => res.send(`Hello World`));

app.get('/secret', isAuthorized, (req, res) => {
  res.json({'message': 'Super secret message'})
}
)
app.get('/readme', (req, res) => {
  res.json({'message': 'Hello world'})
})

app.get('/jwt', (req, res) => {
  let privateKey = fs.readFileSync('./private.pem', 'utf8');
  let token = jwt.sign({'body': 'stuff'}, privateKey, { algorithm: 'HS256'})
  res.send(token)
})

function isAuthorized (req, res, next) {
  if(typeof req.headers.authorization !== 'undefined'){
    let token = req.headers.authorization.split(' ')[1];
    let privateKey = fs.readFileSync('./private.pem', 'utf8');
    jwt.verify(token, privateKey, { algorithm: 'HS256' }, (err, decoded) => {
      if(err){
        res.status(500).json({error: 'Not Auth'})
      }
      console.log(decoded);
      return next();
    })
  } else {
    res.status(500).json({error: 'Not Auth'})
  }
}

app.listen(port, () => console.log(`Started app on ${port}`))