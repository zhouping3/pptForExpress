title: Express - Node.js Web 应用程序框架
speaker: 周平
url: https://github.com/ksky521/nodePPT
transition: zoomin
highlightStyle: zenburn
<!-- theme: dark -->
theme: dark
files: /style.css

[slide style="background-image:url('/bg.png')"]
----
<h1>Express - Node.js Web应用程序框架</h1>
<div class="info">
<h3><span class="keywords">分享者:</span> 周平 (前端-研发工程师)</h3>
<h3><span class="keywords">时间:</span> 11月17日 下午4:30-5:30</h3>
<h3><span class="keywords">地点:</span> 上海图灵会议室(38F)</h3>
</div>
* 什么是Express {:&.rollIn}
* Express与Node.js
* 中间件
* 路由
* 视图

[slide]
# Express
[subslide]
- Express 是一个基于 Node.js 封装的上层服务框架，它提供了更简洁的API跟使用的新功能。
- 它通过中间件和路由让程序的组织管理变的更加容易；它提供了丰富的 HTTP 工具；它让动态视图的渲染变的更加容易；它还定义了一组可拓展标准。
[/subslide]

[slide]
# Express与Node.js

[subslide]
##-----Node.js 
- JS是脚本语言，脚本语言都需要一个解析器才能运行
- 对于写在HTML页面里的JS，浏览器充当了解析器的角色。而对于需要独立运行的JS，NodeJS就是一个解析器
- 每一种解析器都是一个运行环境，不但允许JS定义各种数据结构，进行各种计算，还允许JS使用运行环境提供的内置对象和方法做一些事情。例如运行在浏览器中的JS的用途是操作DOM，浏览器就提供了document之类的内置对象。而运行在NodeJS中的JS的用途是操作磁盘文件或搭建HTTP服务器，NodeJS就相应提供了fs、http等内置对象。

  ============

##-----Node.js创建web程序
<img src="/nodejsweb.png" alt="nodejs" style="width:1000px;height:200px;">
<br>
<img src="/expressweb.png" alt="nodejs" style="width:1000px;height:200px;">


  ============

- `Node.js` 处理请求

```js

var app = http.createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello, world!");
});
```

- `Express` 处理请求

```js
var express = require("express");  
var http = require("http");
var app = express();   

app.use(function(request, response) {  
    response.writeHead(200, { "Content-Type": "text/plain" });      
    response.end("Hello, World!");  
}); 

http.createServer(app).listen(3000);
```

> 多个权限需要对应权限数组相加

[/subslide]
[slide]

# 中间件

`中间件`与原生的Node处理函数非常类似(接受一个请求并做出响应),但是与原生不同的是,中间件将处理过程进行`划分`,并且使用多个函数构成一个完整的`处理流程`
<img src="/nomid.png" alt="nodejs" style="width:1000px;height:100px;margin-top:10px;">
<br>
<img src="/mid.png" alt="nodejs" style="width:1000px;height:200px;">

[slide]

## 中间件

- `中间件` 代码示例

```js
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

// 记录日志中间件
app.use(logger('dev'));

// 用于解析请求的body体中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 解析用户的 cookies中间件
app.use(cookieParser());

// 静态文件中间件
app.use(express.static(path.join(__dirname, 'public')));
.
.
.
```

[slide]

## 路由

- 通过对`HTTP方法`和`URL`进行`映射`来实现对不同请求的分别处理

[slide]

## 路由特性

- `含参的通配路由`

```js
// 匹配传入的请求，如：/users/123，/users/horse_ebooks
  app.get("/users/:userid", function(req, res) {
    // 将userId转换为整型
    var userId = parseInt(req.params.userid, 10);
    // ...
});
```

- `使用正则表达式匹配路由`

```js
  app.get(/^\/users\/(\d+)$/, function(req, res) {
    // 通过序列号接收参数
    var userId = parseInt(req.params[0], 10);
    // ...
});
```

- `捕获查询参数`

```js
  app.get("/search", function(req, res) {
    // req.query.q == "javasript-themed burrito"
    // ...
});
```

[slide]
# 使用Router管理路由
 `app.js`入口文件
```js
  var express = require("express");
  var path = require("path");

  // 引入 API  Router
  var apiRouter = require("./routes/api_router");

  var app = express();
  var staticPath = path.resolve(__dirname, "static");
  app.use(express.static(staticPath));
  // API  Router 文件的调用
  app.use("/api", apiRouter);
  app.listen(3000);
```
 `api_router.js`路由模块
```js
  var express = require("express");
  var ALLOWED_IPS = [
      "127.0.0.1",
      "123.456.7.89"
  ];
  var api  = express.Router();
  api.use(function(req, res, next) {
      var userIsAllowed = ALLOWED_IPS.indexOf(req.ip) !== -1;
      if(!userIsAllowed) {
          res.status(401).send("Not authorized!");
      } else {
          next();
      }
  });
  api.get("/users", function(req, res) { /* ... */ });
  api.post("/users", function(req, res) { /* ... */ });
  api.get("/messages", function(req, res) { /* ... */ });
  api.post("/messages", function(req, res) { /* ... */ });
  module.exports = api;
```

[slide]
# 视图

```js
var express = require("express");
var path = require("path");
var ejs = require("ejs");
var app = express();
app.locals.appName = "Song Lyrics";
//视图引擎（view engine）
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));
app.use(function(req, res, next) {
    res.locals.userAgent = req.headers["user-agent"];
    next();
});
app.get("/about", function(req, res) {
    res.render("about", {
        currentUser: "india-arie123"
    });
});
app.get("/contact", function(req, res) {
    res.render("contact.ejs");
});
app.use(function(req, res) {
    res.status(404);
    res.render("404.html", {
        urlAttempted: req.url
    });
});
app.listen(3000);
```



[slide]
# 使用Router管理路由
[subslide]
## fs.open

```javascript
const fs = require('fs')
// 异步打开
fs.open(filename, flags, [mode], (err, fd) => {
  // fd返回的是一个文件的描述符，是一个数字 
})
// 同步打开文件 
var fs = openSync(filename, flags, [mode])
```
==========

## fs.close

```javascript
fs.open(filename, flags, [mode], (err, fd) => {
  // fd返回的是一个文件的描述符，是一个数字 
  fs.close(fd, err => {})
})
```
========

## fs.read

```javascript
fs.read(fd, buffer, offset, length, position, callback)
``` 

- `fd` 文件描述符，是open方法的回调函数中获取到的，是一个数字。
- `buffer` buffer对象，用于指定将文件数据读取到那个缓存区，如果不定义，则会生成一个新的缓存区，进行存放新读取到的数据。
- `offset` 整数，用于指定向缓存区中写入数据时的开始位置，以字节为单位。其实也就是，读入到缓存中的数据，从buffer对象的第几个元素开始写入。
- `length` 整数，表示读入的数据，多少数据写入到buffer对象中去，要保证不能超出buffer的容纳范围，否则会抛出一个范围异常。
- `position` 整数值，表示，从文件中的哪个位置，开始读取数据，如果设置为非0的整数，则从该整数所示的位置，读取长度为length的数据到buffer对象中。 
- `callback` 三个参数 err,bytesRead,buffer
  - `err`为读取文件操作失败时，触发的错误对象 
  - `bytesRead`为读取到的字节数，如果文件的比较大，则该值就是length的值，如果文件的大小比length小，则该值为实际中读取到的字节数。 
  - `buffer`为读取到的内容，保存到了该缓存区，如果在使用read时，传入了buffer对象，则此处的buffer就是传入的buffer对象。 如果在read时没有传入buffer，则此处的buffer为新创建的buffer对象 

========

```javascript
fs.open('fs.txt', 'r', function(err, fd) {
  //读取fs.text，文件的内容为“123456789”，长度为9
  var buffer = new Buffer([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  //创建一个长度为10，初始值为0的buffer对象。
  //数据比较少，就直接写了，否则还是使用fill方法吧。
  console.log(buffer)
  //<Buffer 00 00 00 00 00 00 00 00 00 00>
  //初始时的buffer对象

  fs.read(fd, buffer, 4, 6, 4, function(err, bytesRead, buffer1) {
    //读取到的数据，从buffer对象的第5个元素开始保存，保存6个字节的元素
    //读取文件，是从文件的第5个字节开始，因为文件中内容长度为9，
    //那么，读取到的内容就是56789，所以buffer的最后一位仍然为初始值。
    //由于想要读取的字节长度为6，但是文件内容过短，只读取了5个字节的有效数据
    //就到了文件的结尾了，所以，bytesRead的值不是6，而是5。
    //而buffer对象，为被写入新数据之后的对象。
    console.log(bytesRead) //5
    console.log(buffer1)
    //<Buffer 00 00 00 00 35 36 37 38 39 00>
    console.log(buffer)
    //<Buffer 00 00 00 00 35 36 37 38 39 00>
    //它们俩是完全相同的。其实质是，它们俩占据的内存也是相同的，
    //它们就是同一个缓存区。
  })
})
```
===============

## fs.write

 ```js
// 写入Buffer数据
fs.write(fd, buffer, offset, length, position, callback)
// 写入str数据内容
fs.write(fd, data[, position[, encoding]], callback)
```     
```js
//使用Buffer写入
fs.open('sam.js', 'w+', (err, fd) => {
    var buf = new Buffer('sam', 'utf8')
    fs.write(fd, buf, 0, buf.length, 0, (err, bw, buf) => {
        fs.close(fd)
    })
})
//直接使用string写入
fs.open('sam.js', 'w+', (err, fd) => {
    fs.write(fd, 'sam', 'utf8', 0, (err, bw, buf) => {
        fs.close(fd)
    })
})
```
=============    
      
## fs.truncate(文件句柄,截断长度,回调函数);

```js
fs.ftruncate(fd, 10, err => {

})
```  
=============   

## fs.fsync(文件句柄,回调函数);

[/subslide]

[slide]
# 文件处理
[slide]
## 读取文件
> read方法,使用来读取已经打开后的文件。 他不用用来进行打开文件操作
```javascript
fs.readFile(fileName,[options],(err,data) => {
  // data为读取成功时，返回的读取信息，该信息的返回格式，是由options对象中的encoding决定 
})
```
> options格式为{ encoding: 'utf-8', flag: 'r' }

- `encoding`表示读取文件成功后，返回的数据的编码格式，默认返回格式为buffer对象
- `flag`的值表示是如何读取文件的，支持的参数，与使用fs.open时相同，通常为r，r+着两种方式。

```javascript
fs.readFile('test.js', 'utf-8', (err,data) => { 
 if (err) { 
  console.log('readFile file error') 
  return false
 } 
 console.log(data)
})
```
[slide]
## 写入文件

```js
fs.writeFile(fileName, data, [options], (err, data) => {
  // data
})
fs.appendFile(fileName, data, [options], (err, data) => {

})
```
> options同上。

```js
// 代码简短清晰
// 同步读取文件，容易阻塞
// 读取大文件时，容易内存溢出
function copy(src, target) {
  console.log(target)
  fs.writeFileSync(target, fs.readFileSync(src))
}
```
[slide]

## 删除文件

```js
fs.unlink(fileName, data, [options], (err, data) => {
  // data
})
```
[slide]
# 文件属性

[subslide]

```js
fs.stat(path,callback); 
//传入的参数是文件路径，和回调函数 
 
fs.lstat(path,callback); 
//传入的参数是目录的路径，和回调函数 
 
fs.fstat(fd,callback); 
//传入的参数是文件描述符，和回调函数 
//所以，该方法在readFile时，在open打开文件成功之后，才使用。 
 
callback(err,stats){ 
//回调函数的参数是相同的，第一个参数为错误对象，包含错误信息 
//第二个参数，也就是本篇文章的重点，为一个State对象的实例，包含对应文件的或者目录的相关信息 
} 
```
======

- `atime` 文件数据上次被访问的时间
- `mtime` 文件上次被修改的时间
- `ctime` 文件状态上次改变的时间
- `birthtime`  文件被创建的时间
- `stats.isFile()`	如果是文件返回 true，否则返回 false。
- `stats.isDirectory()`	如果是目录返回 true，否则返回 false。
- `stats.isBlockDevice()`	如果是块设备返回 true，否则返回 false。
- `stats.isCharacterDevice()`	如果是字符设备返回 true，否则返回 false。
- `stats.isSymbolicLink()`     	如果是软链接返回 true，否则返回 false。
- `stats.isFIFO()   `	如果是FIFO，返回true，否则返回 false。FIFO是UNIX中的一种特殊类型的命令管道。
- `stats.isSocket()	`如果是 Socket 返回 true，否则返回 false。
[/subslide]
[slide]
# 目录处理

[slide]

## 创建目录

```js
fs.mkdir(path[, mode(0777)], () => {})
```
> mkdir无法创建多层级目录

[slide]

## 读取目录

```js
fs.readdir(path, (err, files) => {
  // files 为 目录下的文件数组列表。
})
```

```js
fs.readdir('./testDir', (err, files) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('files', files)
  var count = files.length
  var results = {}
  files.forEach(filename => {
    fs.readFile(`./testDir/${filename}`, 'utf8', (err, data) => {
      results[filename] = data
      count--
      if (count <= 0) {
        // 对所有文件进行处理
        console.log('result', results)
      }
    })
  })
})
```
[slide]
## 删除目录
```js
fs.rmdir(path, ()=>{})
```

> 使用fs.rmdir(path)是有局限性的，只能删除空目录

```js
function rmDirAll(dirpath) {
  var stats = fs.statSync(dirpath) // 获取当前文件的状态
  if (stats.isFile()) {
    // 如果是个文件
    fs.unlinkSync(dirpath)
    console.log(`删除成功： ${dirpath}`)
  } else if (stats.isDirectory()) {
    // 若当前路径是文件夹，则获取路径下所有的信息，并循环
    var files = fs.readdirSync(dirpath)

    files.forEach(item => {
      var itempath = path.join(dirpath, item)
      // var itempath = getLastCode(path) == '/' ? path + item : path + '/' + item // 拼接路径
      var st = fs.statSync(itempath)
      if (st.isFile()) {
        fs.unlinkSync(itempath)
        console.log(`删除成功： ${itempath}`)
      } else if (st.isDirectory()) {
        // 当前是文件夹，则递归检索
        rmDirAll(itempath)
      }
    })
    // 现在可以删除文件夹
    fs.rmdir(dirpath)
    console.log(`删除成功： ${dirpath}`)
  }
}
```
[slide]

# 监听文件
[subslide]

`watchfile`方法监听一个文件，如果该文件发生变化，就会自动触发回调函数。

```js
fs.watchFile(filename[, options], (current, previous) => {
  // 当前的状态对象和以前的状态对象
})
```
[options]
- persistent 表明当文件正在被监视时，进程是否应该继续运行(Default: true)
- interval 表示目标应该每隔多少毫秒被轮询 (Default: 5007)

 ```js
 const fs = require('fs'),
    Event = require('events').EventEmitter,
    event = new Event();


//原始方法getCur
//原始属性prev
var watchFile = function(file,interval,cb){
    var pre,cur;
    var getPrv = function(file){
        var stat = fs.statSync(file);
        return stat;
    }
    var getCur = function(file){
        cur = getPrv(file);
        console.log(cur,pre);
        if(cur.mtime.toString()!==pre.mtime.toString()){
            cb('change');
        }
        pre = cur; //改变初始状态
    }
    var init = (function(){
        pre = getPrv(file); //首先获取pre
        event.on('change',function(){
            getCur(file);
        });
        setInterval(()=>{
            event.emit('change');
        },interval);
    })()
}
watchFile('sam.js',2000,function(eventname){
    console.log(eventname);
})
 ```

=======

`unwatchfile`方法用于解除对文件的监听。

```js
fs.unwatchFile(filename[, listener])
```

[listener]
- eventType <string>
- filename <string> | <Buffer>

========

> fs.watch() 比 fs.watchFile 和 fs.unwatchFile 更高效,fs.watch调用的是native API。而fs.watchFile是调用的是fs.stat

```js
fs.watch(filename[, options][, listener])
```

[options]
- persistent 指明如果文件正在被监视，进程是否应该继续运行。默认 = true
- recursive 指明是否全部子目录应该被监视，或只是当前目录。 适用于当一个目录被指定时，且只在支持的平台（OS X & Windows）。默认 = false
- encoding 指定用于传给监听器的文件名的字符编码。默认 = 'utf8'
[listener]
- eventType 可以是 'rename' 或 'change'
- filename 触发事件的文件的名称

> 在大多数平台，当一个文件出现或消失在一个目录里时，'rename' 会被触发
[/subslide]
[slide]

# 文件流

[slide]

## 创建读取流

```js
fs.createReadStream(path, [options])
```

[options] 

- `flags`指定文件操作，默认'r',读操作；
- `encoding`指定读取流编码；
- `autoClose`是否读取完成后自动关闭，默认true；
- `start`指定文件开始读取位置；end指定文件开始读结束位置


读取数据触发事件：

- open      开始读取文件
- readable  数据可读时
- data      数据读取后
- end       数据读取完成时
- error     数据读取错误时
- close     关闭流对象时


读取数据的对象操作方法：

- read      读取数据方法
- setEncoding   设置读取数据的编
- pause     通知对象众目停止触发data事件
- resume    通知对象恢复触发data事件
- pipe      设置数据通道，将读入流数据接入写入流；
- unpipe    取消通道
- unshift   当流数据绑定一个解析器时，此方法取消解析器


```js
var rs = fs.createReadStream(__dirname + '/test.txt', { start: 0, end: 2 })
//open是ReadStream对象中表示文件打开时事件，
rs.on('open', fd => {
  console.log('开始读取文件')
})

rs.on('data', data => {
  console.log(data.toString())
})

rs.on('end', () => {
  console.log('读取文件结束')
})
rs.on('close', () => {
  console.log('文件关闭')
})

rs.on('error', err => {
  console.error(err)
})

//暂停和回复文件读取；
rs.on('open', () => {
  console.log('开始读取文件')
})

rs.pause()

rs.on('data', data => {
  console.log(data.toString())
})

setTimeout(() => {
  rs.resume()
}, 2000)

```

[slide]

## 创建写入流

```js
fs.createWriteStream(path, [options])
```

 [options]
 - `flags`:指定文件操作，默认'w'
 - `encoding`,指定读取流编码
 - `start`指定写入文件的位置

写入数据触发事件：
- drain            当write方法返回false时，表示缓存区中已经输出到目标对象中，可以继续写入数据到缓存区
- finish           当end方法调用，全部数据写入完成
- pipe             当用于读取数据的对象的pipe方法被调用时
- unpipe           当unpipe方法被调用
- error            当发生错误

写入数据方法：
- write            用于写入数据
  ```js
  /* chunk,  可以为Buffer对象或一个字符串，要写入的数据
  * [encoding],  编码
  * [callback],  写入后回调
  */
  ws.write(chunk, [encoding], [callback]);
  ```
- end              结束写入，之后再写入会报错；
  ```js
  /* [chunk],  要写入的数据
  * [encoding],  编码
  * [callback],  写入后回调
  */
  ws.end([chunk], [encoding], [callback]);
 ```



```js
var ws = fs.createWriteStream(__dirname + '/test.txt', { start: 0 })
var buffer = new Buffer('我也喜欢你')
ws.write(buffer, 'utf8', (err, buffer) => {
  console.log(arguments)
  console.log('写入完成，回调函数没有参数')
})
//最后再写入的内容
ws.end('再见')
```


```js
// createWriteStream方法和createReadStream方法配合，可以实现拷贝大型文件。
var input = fs.createReadStream(fileName)
var output = fs.createWriteStream('./testFile2.txt')

input.on('data', d => {
  // 读取数据写入
  output.write(d)
})
input.on('error', err => {
  throw err
})
input.on('end', () => {
  output.end()
})
```

[slide]

## 管道实现读写

```js
rs.pipe(destination, [options])
 ```

- `destination` 必须一个可写入流数据对象
- `[opations]` end 默认为true，表示读取完成立即关闭文件；


 ```js
// node中支持pipe方法，类似于管道，将读出来的内容通过管道写入到目标文件中
function copy(src, target) {
  var rs = fs.createReadStream(src);
  var ws = fs.createWriteStream(target);
  rs.pipe(ws);
  rs.on('data', function (data) {
    console.log('数据可读')
  });
  rs.on('end', function () {
    console.log('文件读取完成');
    //ws.end('再见')
  });
}
copy('./movie.mkv', './new-movie.mkv')
```
[slide]
# 移动/重命名文件或目录
```js
fs.rename(oldPath, newPath, callback);
```
> 新目录/文件的完整路径及名；如果新路径与原路径相同，而只文件名不同，则是重命名
```js
fs.rename('./renameFile1.txt', './renameFile.txt', function(err) {
  if (err) {
    console.error(err)
    return
  }
  console.log('重命名成功')
})
```

[slide]
# 其他操作
```js
fs.exists(path, callback)
```
```js
const outputFolder = './test'
if (fs.existsSync(outputFolder)) {
  console.log('Removing ' + outputFolder)
  fs.rmdirSync(outputFolder)
} else {
  fs.mkdirSync(outputFolder)
}

```

[slide]
# 压缩文件

```js
// create a file to stream archive data to.
var output = fs.createWriteStream(__dirname + '/example.zip')
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
})

// // listen for all archive data to be written
// // 'close' event is fired only when a file descriptor is involved
output.on('close', function() {
  console.log(archive.pointer() + ' total bytes')
  console.log(
    'archiver has been finalized and the output file descriptor has closed.'
  )
})

// // This event is fired when the data source is drained no matter what was the data source.
// // It is not part of this library but rather from the NodeJS Stream API.
// // @see: https://nodejs.org/api/stream.html#stream_event_end
// output.on('end', function() {
//   console.log('Data has been drained')
// })

// // good practice to catch warnings (ie stat failures and other non-blocking errors)
// archive.on('warning', function(err) {
//   if (err.code === 'ENOENT') {
//     // log warning
//   } else {
//     // throw error
//     throw err
//   }
// })

// // good practice to catch this error explicitly
// archive.on('error', function(err) 
//   throw err
// })

// // pipe archive data to the file
// archive.pipe(output)

// // 追加一个文件流
// var file1 = __dirname + '/fs.md'
// archive.append(fs.createReadStream(file1), { name: 'fs.md' })

// //追加文件
// archive.file('./basic.js', { name: 'basic.js' })

// // 追加testDir并重命名为new-subdir
// archive.directory('./testDir/', 'new-subdir')

// // 追加subdir的内容
// archive.directory('./testDir/', false)

// // // append files from a glob pattern
// // archive.glob('subdir/*.txt')

// // finalize the archive (ie we are done appending files but streams have to finish yet)
// // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
// archive.finalize()

// 解压
// fs.createReadStream('./example.zip').pipe(unzip.Extract({ path: 'example' }))

```

[slide]
# 综合实例
```js
// 文件夹（目录）的复制不同于文件的复制，文件夹操作时还要考虑操作对象是否存在及操作对象的类型（文件或目录）。
function copyDir(src, dist, callback) {
  fs.access(dist, err => {
    if (err) {
      // 目录不存在时创建目录
      fs.mkdirSync(dist)
    }
    _copy(null, src, dist)
  })

  function _copy(err, src, dist) {
    if (err) {
      callback(err)
    } else {
      fs.readdir(src, (err, paths) => {
        if (err) {
          callback(err)
        } else {
          paths.forEach(name => {
            const _src = path.join(src, name)
            const _dist = path.join(dist, name)
            fs.stat(_src, (err, stat) => {
              if (err) {
                callback(err)
              } else {
                // 判断是文件还是目录
                if (stat.isFile()) {
                  fs.writeFileSync(_dist, fs.readFileSync(_src))
                } else if (stat.isDirectory()) {
                  // 当是目录是，递归复制
                  copyDir(_src, _dist, callback)
                }
              }
            })
          })
        }
      })
    }
  }
}
copyDir('./testDir', './new', function(err) {
  if (err) {
    console.log(err)
  }
})
```


```js
// 实现远程文件下载
var url = 'http://s0.hao123img.com/res/img/logo/logonew.png'
http.get(url, function(res) {
  var imgData = ''

  res.setEncoding('binary') //一定要设置response的编码为binary否则会下载下来的图片打不开

  res.on('data', function(chunk) {
    imgData += chunk
  })

  res.on('end', function() {
    console.log(imgData)
    fs.writeFile('./logonew.png', imgData, 'binary', function(err) {
      if (err) {
        console.log('down fail')
      }
      console.log('down success')
    })
  })
})
```
