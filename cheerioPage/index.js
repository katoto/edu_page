// cheerio 爬虫
var cheerio = require('cheerio')
var superagent = require('superagent')
var url = require('url')
var fs = require('fs')
var path = require('path')

var cnodeUrl = 'https://cnodejs.org/'

superagent.get(cnodeUrl).end(function(err, sres) {
    if(err) return false ;
    // var $ = cheerio.load(sres.text)
    // 将decodeEntities修改成 false 可以解决 中文被解析成 unicode 的问题
    var $ = cheerio.load(sres.text, {
        decodeEntities: false
    })
    var topicUrls = [];
    $('#topic_list .topic_title').each(function(idx, element) {
        var $element = $(element);
        var href = url.resolve(cnodeUrl, $element.attr('href'));
        topicUrls.push(href);
    });
    // html() 中文会被解析成 unicode  text() 中文正常
    var result = $($('#topic_list .topic_title')[0]).html()
    console.log(result)
    
    // 写入文件
    fs.writeFile(path.join('./', 'data.js'), JSON.stringify(result), function(err) {
        if (err) throw err;
        console.log("Success ~");
    });
    // 读取内容
    fs.readFile(path.join('./', 'data.js'), 'utf-8', function(err, content){
        console.log(content)
    })
})
