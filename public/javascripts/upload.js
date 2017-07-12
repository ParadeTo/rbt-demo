/**
 * Created by ayou on 17/7/11.
 */

var Upload = function () {
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

  var formData = new FormData()
  formData.append(this.file.name, this.file)
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

var UploadFactory = (function () {
  var createdFlyWeightObjs = null;

  return {
    create: function () {
      if (createdFlyWeightObjs) {
        return createdFlyWeightObjs
      }

      return createdFlyWeightObjs = new Upload()
    }
  }
})()


var uploadManager = (function () {
  var uploadDatabase = {};

  return {
    add: function (id, url, file, onSuccess) {
      var flyWeightObj = UploadFactory.create()

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