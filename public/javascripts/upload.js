/**
 * Created by ayou on 17/7/11.
 */

var Upload = function (options) {
  // 内部状态
  // 每片大小，200kb
  this.chunkSize = (options && options.chunkSize) || 200 * 1024

}

Upload.prototype.listenProgress = function () {
  var self = this
  self.event.listen('progress', function (index, chunkLoaded) {
    self.loadedArr[index] = chunkLoaded

    var loaded = self.loadedArr.reduce(function (a, b) {
      return a + b
    })

    self.dom.querySelector('.progress').value = loaded / self.file.size * 100
  })
}

Upload.prototype.init = function (id) {
  // 设置外部状态
  uploadManager.setExternalState(id, this)

  this.listenProgress()
  console.log(this.event)
  // 分片上传
  this.upload()
}

Upload.prototype.upload = function () {
  var self = this
  var chunkCount = Math.ceil(this.file.size / this.chunkSize)
  for (var i = 0; i < chunkCount; i++) {
    var start = i * this.chunkSize,
      end = Math.min(this.file.size, start + this.chunkSize);

    var formData = new FormData()
    formData.append('data', this.file.slice(start, end))
    formData.append('name', this.file.name)
    formData.append('chunkSize', this.chunkSize)
    formData.append('chunkCount', chunkCount)
    formData.append('index', i)

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
    xhr.upload.onprogress = (function(i){
      return function (e) {
        if (e.lengthComputable) {
          self.event.trigger('progress', i, e.loaded)
        }
      }
    })(i)
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
  var fileListObj = document.querySelector('#fileList')

  return {
    add: function (id, url, file, onSuccess) {
      var flyWeightObj = UploadFactory.create({chunkSize: 1024 * 1024 * 30})

      var dom = document.createElement('div')
      dom.className = 'box'
      dom.innerHTML =  '<div class="is-flex file-info">' +
                          '<h3>' + file.name + '</h3>' +
                          '<span>' + file.size / 1024 + 'kb</span>' +
                          '<div>' +
                            '<button>删除</button>' +
                          '</div>' +
                        '</div>' +
                        '<progress class="progress is-small is-info" value="0" max="100">0%</progress>'
      fileListObj.append(dom)

      uploadDatabase[id] = {
        loadedArr: [],
        event: Object.assign({}, Event),
        url: url,
        file: file,
        onSuccess: onSuccess,
        dom: dom
      }

      flyWeightObj.init(id)
    },
    setExternalState: function (id, flyWeightObj) {
      var uploadData = uploadDatabase[id]
      for (var i in uploadData) {
        flyWeightObj[i] = uploadData[i]
      }
    }
  }
})()