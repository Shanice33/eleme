//在本地启动一个server，测试运行这些打包后的文件；
var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function (req, res, next) {
  req.url = '/index.html';
  next();
});

app.use(router);

//生产环境下配置测试mock数据
var appData = require('./data.json')
var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings

var appRoutes = express.Router();

appRoutes.get('/seller', function (req, res) {
  res.json({
    errCode: 0,
    data: seller
  });
});

appRoutes.get('/goods', function (req, res) {
  res.json({
    errCode: 0,
    data: goods
  });
});

appRoutes.get('/ratings', function (req, res) {
  res.json({
    errCode: 0,
    data: ratings
  });
});

app.use('/api', appRoutes);
app.use(express.static('./dist'));

module.exports = app.listen(port, function (err) {
  if(err){
    console.log(err);
    return;
  }
  console.log('listening at http://localhost:'+ port + '\n');
})
