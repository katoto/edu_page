const puppeteer = require('puppeteer')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://47.96.234.59:27017/'
// 2、查询数据
let selectData = function (db, callback) {
    //连接到表  
    var collection = db.collection('edu_zixun')
    //查询数据
    var whereStr = {};
    collection.find(whereStr).toArray(function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err
    var dbo = db.db('katoto')
    selectData(dbo, function (result) {
        getList(result, dbo)
    });
})
let getList = async (result, dbo) => {
    const browser = await (puppeteer.launch({
        ignoreHTTPSErrors: true,
        devtools: false,
        headless: false,
        args: ['--no-sandbox']
    }))
    for (let i = 0, len = result.length; i < len; i++) {
        const page = await browser.newPage()
        // await page.goto('http://xiaoxue.xdf.cn/201811/10825044.html')
        await page.goto(result[i].titleLink)
        const basekutu = await page.evaluate(() => {
            let kutu = {
                artLy: null,
                artmsg: null
            }
            kutu['artLy'] = document.querySelector('.article .art_xin .art_ly span').innerHTML
            kutu['artmsg'] = document.querySelector('.article .air_con').innerHTML
            return kutu
        })
        basekutu._id = result[i]._id
        await updatemsg(basekutu, dbo)
        // dbo.collection('edu_zixun').update({ "_id": "201811/10825044" }, { $set: { artmsg: result[i].artLy, artLy: result[i].artLy } })
    }
    browser.close()
}
let updatemsg = function (res, dbo) {
    return new Promise((resolve, reject) => {
        dbo.collection('edu_zixun').update({ "_id": res._id }, { $set: { artmsg: res.artmsg, artLy: res.artLy } }, function () {
            resolve(1)
        })
    })
}