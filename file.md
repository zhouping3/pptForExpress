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
<h1 style="margin-top: -100px;margin-bottom: 150px;">Express - Node.js Web应用程序框架</h1>
<div class="info">
<h3><span class="keywords">分享者:</span> 周平 (前端-研发工程师)</h3>
<h3><span class="keywords">时间:</span> 11月17日 下午5:00-6:00</h3>
<h3><span class="keywords">地点:</span> 上海图灵会议室(38F)</h3>
</div>
* 什么是Express {:&.rollIn}
* Express与Node.js
* 中间件
* 路由
* 视图
* 案例 - 调试

[slide]
# Express
[subslide]
- Express 是一个基于 `Node.js` 封装的上层服务框架，它提供了更简洁的API跟使用的新功能。
- 它通过中间件和路由让程序的组织管理变的更加容易；它提供了丰富的 HTTP 工具；它让动态视图的渲染变的更加容易；它还定义了一组可拓展标准。

 ============
- `优点：` 极简 灵活  高度可配置 JavaScript全栈
- `缺点：` 部分功能缺失  不适合CPU密集型应用
[/subslide]

[slide]
# Express与Node.js

[subslide]
##-----Node.js 
- Node.js 是一个 JavaScript 代码的运行平台
- JS是脚本语言，脚本语言都需要一个解析器才能运行
- 对于写在HTML页面里的JS，浏览器充当了解析器的角色。而对于需要独立运行的JS，NodeJS就是一个解析器
- 解析器可以看做是一个运行环境，允许JS定义各种数据结构，进行各种计算，还允许JS使用运行环境提供的内置对象和方法做一些事情。

  ============

##-----创建web程序
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

> ...

[/subslide]
[slide]

# 中间件

`中间件`与原生的Node处理函数非常类似(接受一个请求并做出响应),但是与原生不同的是,中间件将处理过程进行`划分`,并且使用多个函数构成一个完整的`处理流程`
<img src="/nomid.png" alt="nodejs" style="width:1000px;height:100px;margin-top:10px;">
<br>
<img src="/mid.png" alt="nodejs" style="width:1000px;height:200px;">

[slide]

## 中间件

- `中间件使用` app.use(fn)

```js
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
// 一个简单的中间件
function middleware(req,res,next){
    // 做该干的事

    // 做完后调用下一个函数
    next();
}
app.use(middleware(req,res,next));

// 记录日志中间件
app.use(logger('dev'));
// 用于解析请求的body体中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 解析用户的 cookies中间件
app.use(cookieParser());
// 静态文件中间件
app.use(express.static(path.join(__dirname, 'public')));
// 错误处理中间件
app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});
```
[slide]
# express中使用中间件的好处
* 逻辑清楚，层次分明 {:&.rollIn}
* 便于维护
* 可复用

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
# 案例
 <p style="text-align:center"> <a href="http://localhost:3000/" target="_blank">一个小Demo</a></p>

[slide style="background-image:url('/bg.png')"]
  # 谢谢 ！


