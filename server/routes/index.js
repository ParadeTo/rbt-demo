var express = require('express');
var router = express.Router();
var formidable = require('formidable')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '断点续传DEMO' });
});

router.post('/upload', function (req, res, next) {
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    console.log(files)
  })
})

module.exports = router;
