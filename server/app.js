var express = require('express');
var app     = express();

app.get('*', function(req, res) {
  res.json({cool: 'nice'});
})

app.post('/echo', function(req, res) {
  res.json({great: 'grand'});
})
