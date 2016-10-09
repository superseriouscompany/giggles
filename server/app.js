var express = require('express');
var multer  = require('multer');
var app     = express();
var UUID    = require('node-uuid');
var port    = process.env.PORT || 3000;

var storage = multer.diskStorage({
  destination: 'captions/',
  filename: function(req, file, cb) {
    console.log(file);
    const uuid = UUID.v1();
    const extension = file.originalname.split('.')[1];
    if( !extension )  { return cb(null, uuid); }
    cb(null, `${uuid}.${extension}`);
  }
})
var upload  = multer({storage: storage});

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
