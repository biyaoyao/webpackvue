/**
 * Created by v-biyaoyao on 2017/6/22.
 */
var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    concat = require('gulp-concat'),
    revReplace = require('gulp-rev-replace'),
    useref = require('gulp-useref'),
    revReplace = require('gulp-rev-replace'),
    revCollector = require('gulp-rev-collector');
var Proxy = require('gulp-connect-proxy');
var connect = require('gulp-connect');
gulp.task("server", function () {
    connect.server({
        root: "app",
        port: 8000,
        livereload: true,
        middleware: function (connect, opt) {
            opt.route = '/proxy';
            opt.target= 'http://192.168.1.109:8080';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    });
});
/*gulp.task('server',function(){

 connect.server({

 root:"optometry",

 port:8000,

 livereload:true,

 middleware:function(connect, opt){

 return [

 Proxy('/api', {// configure proxy middleware

 // context: '/' will proxy all requests

 // use: '/api' to proxy request when path starts with '/api'

 target: 'http://192.168.1.109:8080',

 changeOrigin:true    // for vhosted sites, changes host header to match to target's host

 })

 ];

 }

 });

 });*/
//清空文件夹，避免资源冗余

gulp.task('clean',function(){
    return gulp.src('dist',{read:false}).pipe(clean());
});

//css文件压缩，更改版本号，并通过rev.manifest将对应的版本号用json表示出来

gulp.task('css',function(){
    return gulp.src('static/**/*.css')
    //.pipe( concat('wap.min.css') )

        .pipe(rev())
        .pipe(gulp.dest('dist/static/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/css'))
});

//js文件压缩，更改版本号，并通过rev.manifest将对应的版本号用json表示出

gulp.task('js',function(){
    return gulp.src('static/**/*.js')
    //.pipe( concat('wap.min.js') )

        .pipe(rev())
        .pipe(jshint())
        .pipe(gulp.dest('dist/static/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/js'))
});
//js文件压缩，更改版本号，并通过rev.manifest将对应的版本号用json表示出

gulp.task('png',function(){
    return gulp.src('static/**/*.png')
    //.pipe( concat('wap.min.js') )

        .pipe(gulp.dest('dist/static/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/img'))
});
//js文件压缩，更改版本号，并通过rev.manifest将对应的版本号用json表示出

gulp.task('jpg',function(){
    return gulp.src('static/**/*.jpg')
    //.pipe( concat('wap.min.js') )

        .pipe(gulp.dest('dist/static/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/img'))
});
//js文件压缩，更改版本号，并通过rev.manifest将对应的版本号用json表示出

gulp.task('woff',function(){
    return gulp.src('static/**/*.woff')
    //.pipe( concat('wap.min.js') )

        .pipe(gulp.dest('dist/static/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/woff'))
});
gulp.task('gif',function(){
    return gulp.src('static/**/*.gif')
    //.pipe( concat('wap.min.js') )

        .pipe(gulp.dest('dist/static/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/img'))
});
//通过hash来精确定位到html模板中需要更改的部分,然后将修改成功的文件生成到指定目录

gulp.task('rev',function(){
    return gulp.src(['dist/rev/**/*.json','views/**/*.html'])
        .pipe( revCollector() )
        .pipe(gulp.dest('dist/views/'));
});
gulp.task('default', [ 'css','js','png','jpg','woff','gif']);
