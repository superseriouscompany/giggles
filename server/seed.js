'use strict';

const request = require('request');
const fs      = require('fs');

request({
  method: 'POST',
  url: 'http://localhost:3000/submissions',
  formData: {
    photo: fs.createReadStream('./fixtures/photo3.jpg'),
  }
}, function(err, resp, body) {
  if( err ) { throw err; }

  console.log(resp.statusCode, body);
})

request({
  method: 'POST',
  url: 'http://localhost:3000/submissions',
  formData: {
    photo: fs.createReadStream('./fixtures/photo4.jpg'),
  }
}, function(err, resp, body) {
  if( err ) { throw err; }

  console.log(resp.statusCode, body);
})

request({
  method: 'POST',
  url: 'http://localhost:3000/submissions',
  formData: {
    photo: fs.createReadStream('./fixtures/photo5.jpg'),
  }
}, function(err, resp, body) {
  if( err ) { throw err; }

  console.log(resp.statusCode, body);
})

setTimeout(function() {
  request({
    method: 'POST',
    url: 'http://localhost:3000/next',
  }, function(err, resp, body) {
    if( err ) { throw err; }

    console.log(resp.statusCode, body);
  })
}, 500);
