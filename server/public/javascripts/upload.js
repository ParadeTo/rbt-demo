/**
 * Created by ayou on 17/7/11.
 */

var Upload = function (url, file) {
  this.url = url
  this.file = file
}

Upload.prototype.init = function () {
  this.xhr = new XMLHttpRequest()
  this.xhr.open('post', this.url)
}

Upload.prototype.start = function () {
  this.xhr.send(this.file)
}

Upload.prototype.onSc