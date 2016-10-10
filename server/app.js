var express = require('express');
var multer  = require('multer');
var app     = express();
var UUID    = require('node-uuid');
var port    = process.env.PORT || 3000;

var captionStorage = multer.diskStorage({
  destination: 'captions/',
  filename: function(req, file, cb) {
    const uuid = UUID.v1();
    const extension = file.originalname.split('.')[1];
    if( !extension )  { return cb(null, uuid); }
    cb(null, `${uuid}.${extension}`);
  }
})
var submissionStorage = multer.diskStorage({
  destination: 'submissions/',
  filename: function(req, file, cb) {
    const uuid = UUID.v1();
    const extension = file.originalname.split('.')[1];
    if( !extension )  { return cb(null, uuid); }
    cb(null, `${uuid}.${extension}`);
  }
})

var captionUpload    = multer({storage: captionStorage});
var submissionUpload = multer({storage: submissionStorage});

var captions = [];

app.use(express.static('captions'));

app.get('/', function(req, res) {
  res.json({cool: 'nice'});
})

app.post('/foo', submissionUpload.single('photo'), function(req, res) {
  console.log("got a post", req.file);
  res.json({cool: 'nice'});
})

app.post('/captions', captionUpload.single('audio'), function(req, res) {
  console.log("got a post", req.file);
  if( req.file && req.file.filename ) {
    captions.push({
      filename: req.file.filename
    })
  }
  res.json({cool: 'nice'});
})

app.get('/captions', function(req, res) {
  res.json({
    captions: captions
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
})
