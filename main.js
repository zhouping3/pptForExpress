var rs = fs.createReadStream(__dirname + '/test.txt', { start: 0, end: 2 })
//open是ReadStream对象中表示文件打开时事件，
rs.on('open', function(fd) {
  console.log('开始读取文件')
})

rs.on('data', function(data) {
  console.log(data.toString())
})

rs.on('end', function() {
  console.log('读取文件结束')
})
rs.on('close', function() {
  console.log('文件关闭')
})

rs.on('error', function(err) {
  console.error(err)
})

//暂停和回复文件读取；
rs.on('open', function() {
  console.log('开始读取文件')
})

rs.pause()

rs.on('data', function(data) {
  console.log(data.toString())
})

setTimeout(function() {
  rs.resume()
}, 2000)
