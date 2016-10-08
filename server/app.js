var express = require('express');
var multer  = require('multer');
var upload  = multer({storage: multer.memoryStorage()});
var app     = express();
var port    = process.env.PORT || 3000;

app.get('*', function(req, res) {
  res.json({cool: 'nice'});
})

app.post('/foo', upload.array(), function(req, res) {
  console.log(req.body);
  res.json(req.body);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
})
