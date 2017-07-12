/**
 * Created by ayou on 17/7/11.
 */

var Upload = function (options) {
  // 内部状态
  // 每片大小，200kb
  this.chunkSize = options.chunkSize || 200 * 1024

  // 外部状态
  this.url = null
  this.onSuccess = null
  this.file = null
}

// TODO 分片上传
Upload.prototype.upload = function (id) {
  var self = this
  // 设置外部状态
  uploadManager.setExternalState(id, this)

  // 分片上传
  var chunkCount = Math.ceil(this.file.size / this.chunkSize)
  for (var i = 0; i < chunkCount; i++) {
    var start = i * this.chunkSize,
        end = Math.min(this.file.size, start + this.chunkSize);

    var formData = new FormData()
    formData.append('date', this.file.slice(start, end))
    formData.append('name', this.file.name)
    formData.append('total', chunkCount)
    formData.append('index', i+1)

    var xhr = new XMLHttpRequest()
    xhr.open('post', this.url)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          self.onSuccess(xhr.responseText)
        } else {
          console.log(xhr.status)
        }
      }
    }
    xhr.send(formData)
  }
}

var UploadFactory = (function () {
  var createdFlyWeightObjs = null;

  return {
    create: function (options) {
      if (createdFlyWeightObjs) {
        return createdFlyWeightObjs
      }

      return createdFlyWeightObjs = new Upload(options)
    }
  }
})()


var uploadManager = (function () {
  var uploadDatabase = {};

  return {
    add: function (id, url, file, onSuccess) {
      var flyWeightObj = UploadFactory.create({chunkSize: 1024})

      uploadDatabase[id] = {
        url: url,
        file: file,
        onSuccess: onSuccess
      }

      flyWeightObj.upload(id)
    },
    setExternalState: function (id, flyWeightObj) {
      var uploadData = uploadDatabase[id]
      for (var i in uploadData) {
        flyWeightObj[i] = uploadData[i]
      }
    }
  }
})()