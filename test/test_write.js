/**
 * Created by ayou on 2017/7/12.
 */
const fs = require('fs')
const EventEmitter = require('events')

/**
 * 文件合并类
 * @param destFilename
 * @param chunkSize
 * @param chunkCount
 * @constructor
 */
class FileMerge extends EventEmitter {
  constructor (destFilename, chunkSize, chunkCount) {
    super()
    this.destFilename = destFilename
    this.chunkSize = chunkSize
    this.chunkCount = chunkCount
    // 已经合并过的分块
    this.doneIndex = []
  }

  getChunkSize (index) {
    states = fs.statSync(this.destFilename + `.part${index}`);
    return states.size
  }

  writeToDest (index) {
    var start = index * this.chunkSize
    var fr = fs.createReadStream(this.destFilename + `.part${index}`)
    var fw = fs.createWriteStream(this.destFilename, {
      start: start
    })

    fr.pipe(fw)
    fr.on('end', () => {
      fw.close()
      this.emit('write_done', index)

      this.doneIndex.push(index)
      if (this.doneIndex.length === this.chunkCount) {
        this.emit('all_done')
      }
    })
  }
}

module.exports = FileMerge

// var fm = new FileMerge('./test.txt', 3, 3)
// fm.on('all_done', function (index) {
//   states = fs.statSync('./test.txt');
//   console.log(states.size)
// })
// fm.writeToDest(1)
// fm.writeToDest(0)
// fm.writeToDest(2)
// fm
// var fw = fs.createWriteStream('./out.txt', {
//   start: 0
// })
// var fr1 = fs.createReadStream('./1.txt')
// fr1.pipe(fw)

