'use strict';

const request = require('request');
const fs      = require('fs');

request({
  method: 'POST',
  url: 'http://localhost:3000/submissions',
  formData: {
    photo: fs.createReadStream('./fixtures/photo.jpg'),
  }
}, function(err, resp, body) {
  if( err ) { throw err; }

  console.log(resp.statusCode, body);
})

request({
  method: 'POST',
  url: 'http://localhost:3000/submissions',
  formData: {
    photo: fs.createReadStream('./fixtures/photo1.jpg'),
  }
}, function(err, resp, body) {
  if( err ) { throw err; }

  console.log(resp.statusCode, body);
})

request({
  method: 'POST',
  url: 'http://localhost:3000/submissions',
  formData: {
    photo: fs.createReadStream('./fixtures/photo2.jpg'),
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
