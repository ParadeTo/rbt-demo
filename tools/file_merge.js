/**
 * Created by ayou on 2017/7/12.
 */
const fs = require('fs')
const EventEmitter = require('events')
const Utils = require('./utils')

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

  /**
   * 将某一块合并到最后的目标文件
   * @param index 块索引
   */
  writePartToDest (index) {
    var start = index * this.chunkSize
    var fr = fs.createReadStream(this.destFilename + `.part${index}`)

    var options = {start: start}
    if (fs.existsSync(this.destFilename)) {
      options.flags = 'r+'
    } else {
      options.flags = 'w'
    }
    var fw = fs.createWriteStream(this.destFilename, options)

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

  /**
   * 将可读流数据追加到分块的末尾
   * @param fr
   * @param part
   */
  // appendToPart (fr, part) {
  //
  // }
}

module.exports = FileMerge

// var fm = new FileMerge('../upload/testupload1.txt', 10, 6)
// fm.on('write_done', function (index) {
//   file = fs.readFileSync('../upload/testupload1.txt', 'utf-8');
//   console.log(file)
// })
// fm.writePartToDest(5)
// setTimeout(() => {
//   fm.writePartToDest(1)
// }, 1000)
// setTimeout(() => {
//   fm.writePartToDest(4)
// }, 2000)
// setTimeout(() => {
//   fm.writePartToDest(3)
// }, 3000)
// setTimeout(() => {
//   fm.writePartToDest(2)
// }, 4000)
// setTimeout(() => {
//   fm.writePartToDest(0)
// }, 5000)


