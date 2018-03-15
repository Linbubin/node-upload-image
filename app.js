var fs = require('fs');
var express = require('express');
var multer  = require('multer'); // 用来保存文件

// 启express
var app = express();

// 配置multer
var storage = multer.diskStorage({
  // 保存位置
  destination: function(req, file, cb) {
      cb(null, './uploads');
  },
  // 保存文件名
  filename: function(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
  }
})
var upload = multer({ storage: storage });

// 增加跨域许可
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  return next();
});

// 默认访问，可删除
app.get('/', function (req,res){
  res.send('over');
})

// 读取img文件，并展示 url: localhost/photo?filename=111.jpg
app.get('/photo', function (req,res){
  // 传入url后面的参数
  const filename = req.query.filename;
  
  // 读取uploads下的文件
  fs.readFile(`./uploads/${filename}`,'binary',function(err, file) {
    // 如果读取失败(测试时，基本原因为文件不存在.真实环境中，应该不会读取失败)
    if(err){
      // 读取 no_people.jpg这张图
      fs.readFile(`./uploads/no_people.jpg`,'binary',function(err, file1) {
        // 这张图事先放好，保证读取成功
        if(err) return res.send(err);
        // 设置 输出的head
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        // 将图片输出
        res.write(file1,'binary');
        // end
        res.end();
      })
    }else{
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.write(file,'binary');
      res.end();
    }
    
  })
})

// 用 multer将文件保存到相应位置，并将文件名返回
app.post('/upload', upload.any(),function (req,res){
  res.send({filename: req.files[0].filename});
})

// 启动服务： 默认端口号为3000
app.listen(3000, function(){
        console.log('ok')
})