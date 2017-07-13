/**
 * Created by ayou on 2017/7/13.
 */
var Event = {
  clientList: [],
  listen: function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn)
  },
  trigger: function () {
    var key = Array.prototype.shift.call(arguments),
        fns = this.clientList[key]

    if (!fns || fns.length === 0) {
      return false
    }

    for (var i = 0, fn; fn = fns[i++]; ) {
      fn.apply(this, arguments)
    }
  }
}