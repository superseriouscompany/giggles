var express = require('express');
var app     = express();
var port    = process.env.PORT || 3000;

app.get('*', function(req, res) {
  res.json({cool: 'nice'});
})

app.post('/foo', function(req, res) {
  res.json({good: 'grand'});
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
})
