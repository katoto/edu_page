// 年摘详情
const puppeteer = require('puppeteer')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://47.96.234.59:27017/'
    // 2、查询数据
let selectData = function(db, callback) {
    //连接到表  
    var collection = db.collection('nianzhai_list')
        //查询数据
    var whereStr = {};
    collection.find(whereStr).toArray(function(err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err
    var dbo = db.db('katoto')
    selectData(dbo, function(result) {
        getList(result, dbo)
    });
})
let getList = async(result, dbo) => {
    const browser = await (puppeteer.launch({
        ignoreHTTPSErrors: true,
        devtools: false,
        headless: false,
        args: ['--no-sandbox']
    }))
    console.log(result.length)
        // for (let i = 0, len = result.length; i < len; i++) {
    for (let i = 49, len = result.length; i < len; i++) {
        const page = await browser.newPage()
            // await page.goto('https://qingniantuzhai.com/qing-nian-tu-zhai-0121/', {
            //     timeout: 120000
            // })
        await page.goto('https://qingniantuzhai.com' + result[i].titleLink, {
            timeout: 120000
        })
        const basekutu = await page.evaluate(() => {
            let kutu = {
                arteye: null,
                artmsg: null
            }
            if (document.querySelector('.post .post_icon .posteye')) {
                kutu['arteye'] = document.querySelector('.post .post_icon .posteye').innerHTML
            }
            if (document.querySelector('.post .post-content')) {
                kutu['artmsg'] = document.querySelector('.post .post-content').innerHTML
            }
            return kutu
        })
        basekutu._id = result[i]._id
        updatemsg(basekutu, dbo)
    }
    browser.close()
}
let updatemsg = function(res, dbo) {
    dbo.collection('nianzhai_listmsg').save(res)
        // return new Promise((resolve, reject) => {
        //     dbo.collection('nianzhai_listmsg').save(res)
        //         // dbo.collection('edu_zixun').update({ "_id": res._id }, { $set: { artmsg: res.artmsg, artLy: res.artLy } }, function() {
        //         //     resolve(1)
        //         // })
        // })
}