var express = require('express');
var fs = require('fs');
var router = express.Router();
var formidable = require('formidable')
var Utils = require('../tools/utils')
var FileMerge = require('../tools/file_merge')

var tmpDir = __dirname + '/../tmp',
    uploadDir = __dirname + '/../upload'

var uploadDatabase = {}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '断点续传DEMO' });
});

router.post('/upload', function (req, res, next) {
  Utils.mkdirsSync(tmpDir)
  var form = new formidable.IncomingForm()
  form.uploadDir = tmpDir;

  form.parse(req, function (err, fields, files) {
    console.log(fields)
    var {name, chunkSize, chunkCount, index} = fields
    var destFilename = uploadDir + `/${name}`

    if (!uploadDatabase[name]) {
      uploadDatabase[name] = new FileMerge(destFilename, chunkSize, chunkCount)
      console.log(uploadDatabase[name])
    }

    if (err) {
      res.send({
        error: {
          msg: '上传文件失败',
          index: fields.index,
          name: fields.name,
          total: fields.total
        }
      });
    } else {
      try {
        // TODO 如果该part存在，就追加到后面
        fs.renameSync(files.data.path, destFilename + `.part${index}`)

        uploadDatabase[name].on('write_done', function (index) {
          // console.log(uploadDatabase[name])
          // states = fs.statSync(destFilename + `.part${fields.index}`);
          // console.log(states.size)
        })

        // 合并
        uploadDatabase[name].writePartToDest(index)


        res.send({
          success: {
            msg: '上传文传成功',
            index: fields.index,
            name: fields.name,
            total: fields.total
          }
        });
      } catch (err) {
        console.log(err)
      }
    }
  })
})

module.exports = router;
