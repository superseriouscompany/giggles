var express = require('express');
var multer  = require('multer');
var upload  = multer({storage: multer.memoryStorage()});
var app     = express();
var port    = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.json({cool: 'nice'});
})

app.post('/foo', upload.single('photo'), function(req, res) {
  console.log("got a post", req.file);
  res.json({cool: 'nice'});
})

app.post('/captions', upload.single('audio'), function(req, res) {
  console.log("got a post", req.file);
  res.json({cool: 'nice'});
})

app.get('/captions', function(req, res) {
  res.json({
    captions: [
      'cool',
      'nice',
      'good',
      'great',
      'grand',
      'cool',
      'nice',
      'good',
      'great',
      'grand',
      'cool',
      'nice',
      'good',
      'great',
      'grand',
      'cool',
      'nice',
      'good',
      'great',
      'grand',
    ]
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
})
