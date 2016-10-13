'use strict';

const express = require('express');
const multer  = require('multer');
const app     = express();
const UUID    = require('node-uuid');
const port    = process.env.PORT || 3000;

let captionStorage = multer.diskStorage({
  destination: 'captions/',
  filename: function(req, file, cb) {
    const uuid = UUID.v1();
    const extension = file.originalname.split('.')[1];
    if( !extension )  { return cb(null, uuid); }
    cb(null, `${uuid}.${extension}`);
  }
})
let submissionStorage = multer.diskStorage({
  destination: 'submissions/',
  filename: function(req, file, cb) {
    const uuid = UUID.v1();
    const extension = file.originalname.split('.')[1];
    if( !extension )  { return cb(null, uuid); }
    cb(null, `${uuid}.${extension}`);
  }
})

let captionUpload    = multer({storage: captionStorage});
let submissionUpload = multer({storage: submissionStorage});

let captions    = [],
    submissions = [];

app.use(express.static('captions'));

app.get('/', function(req, res) {
  res.json({cool: 'nice'});
})

app.post('/submissions', submissionUpload.single('photo'), function(req, res) {
  const uuid = UUID.v1();
  if( req.file && req.file.filename ) {
    submissions.push({
      id: uuid,
      filename: req.file.filename
    })
    res.status(201).json({id: uuid});
  }
})

app.post('/captions', captionUpload.single('audio'), function(req, res) {
  const uuid = UUID.v1();
  if( req.file && req.file.filename ) {
    captions.push({
      id: uuid,
      filename: req.file.filename,
    })
  }
  res.status(201).json({id: uuid});
})

app.post('/captions/:id/like', function(req, res) {
  var caption = captions.find(function(c) { return c.id === req.params.id });
  if( !caption ) { return res.sendStatus(404); }
  caption.likes = caption.likes || 0;
  caption.likes++;
  res.sendStatus(204);
})

app.post('/captions/:id/hate', function(req, res) {
  var caption = captions.find(function(c) { return c.id === req.params.id });
  if( !caption ) { return res.sendStatus(404); }
  caption.hates = caption.hates || 0;
  caption.hates++;
  res.sendStatus(204);
})

app.get('/submissions', function(req, res) {
  res.json({
    submissions: submissions
  })
})

app.get('/captions', function(req, res) {
  res.json({
    captions: captions
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
})
