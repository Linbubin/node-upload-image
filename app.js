var fs = require('fs');
var express = require('express');

var app = express();
var multer  = require('multer')

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './node-image/uploads');
  },
  filename: function(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
  }
})
var upload = multer({ storage: storage });

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  return next();
});

app.get('/', function (req,res){
  res.send('over');
})

app.get('/photo', function (req,res){
  const filename = req.query.filename;
  
  fs.readFile(`./node-image/uploads/${filename}`,'binary',function(err, file) {
    if(err){
      fs.readFile(`./node-image/uploads/no_people.jpg`,'binary',function(err, file1) {
        if(err) return res.send(err);
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.write(file1,'binary');
        res.end();
      })
    }else{
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.write(file,'binary');
      res.end();
    }
    
  })
})

app.post('/upload', upload.any(),function (req,res){
  res.send({filename: req.files[0].filename});
})

app.listen(3000, function(){
        console.log('ok')
})
