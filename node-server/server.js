let express = require('express');
let app = express();
let path = require('path');
let http = require('http');
let ejs = require('ejs');
let router = require('./router');
let server = http.createServer(app);
let url = require('url');
let colors = require('colors');
let host="127.0.0.1";
let port=8080;
let serverPort = 3000;
app.set('views', path.join(__dirname, '../dist/views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html'); //替换文件扩展名ejs为html
app.use(express.static(path.join(__dirname, '../dist/')));
app.get('/', function(req, response, next) {//主页
	response.redirect('/admin/login');
});


app.use('/api/*', function(request, response, next) {//接口转发
	let path=request.originalUrl.split('/api')[1];
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	response.setHeader("X-Powered-By", ' 3.2.1')
	response.setHeader("Content-Type", "application/json;charset=utf-8");
	console.log(JSON.stringify(request.headers));
	let options = {
		host: host,
		port: port,
		method: 'GET', //这里是发送的方法
		path: path,
		headers: {
			token: request.headers.accept
		}
	};
	//以下是接受数据的代码
	let body = '';
	let req = http.request(options, function(res) {
		res.on('data', function(d) {
			body += d;
		}).on('end', function() {
			console.log(("转发的链接是:").gray+("http://"+host+":"+port+path).green);
			response.end(body);
		});

	}).on('error', function(e) {

		console.log(("Got error: " + e.message).red);
		response.end(""+{"code":-111,"data":null,"errMsg":e.message});
	})
	req.end();
	//response.send('api:'+path);
});

app.get('/*', function(req, response, next) {//通用控制器
	let path=req.url.split("?")[0].split("#")[0].split(".html")[0];
	console.log(path.substring(1,path.length));
	if(router.indexOf(path)>-1){
		response.render(path.substring(1,path.length));
	}else{
		response.render('error/error');

	}
});
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		title: "500",
		msg: "服务器出错",
		error: {}
	});
});
server.listen(serverPort);
console.log('Listening on  '+serverPort);
module.exports = app;