const puppeteer = require('puppeteer')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://47.96.234.59:27017/'
    // 2、查询数据  年级爬虫
let selectData = function(db, callback) {
    //连接到年级表
    // var collection = db.collection('edu_class1_shuxue')
    // var collection = db.collection('edu_class1_yingyu')
    // var collection = db.collection('edu_class1_yuwen')
    // var collection = db.collection('edu_class2_shuxue')
    // var collection = db.collection('edu_class2_yingyu')
    // var collection = db.collection('edu_class2_yuwen')
    // var collection = db.collection('edu_class3_shuxue')
    // var collection = db.collection('edu_class3_yingyu')
    // var collection = db.collection('edu_class3_yuwen')
    // var collection = db.collection('edu_class4_shuxue')
    // var collection = db.collection('edu_class4_yingyu')
    // var collection = db.collection('edu_class4_yuwen')

    // var collection = db.collection('edu_class5_shuxue')
    // var collection = db.collection('edu_class5_yingyu')
    // var collection = db.collection('edu_class5_yuwen')

    // var collection = db.collection('edu_class6_shuxue')
    // var collection = db.collection('edu_class6_yingyu')
    var collection = db.collection('edu_class6_yuwen')
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
    for (let i = 0, len = result.length; i < len; i++) {
        // for (let i = 0; i < 1; i++) {
        const page = await browser.newPage()
            // await page.goto('http://www.dlrzy.com/a/xiaoxueyinian/yuwen/2018/0314/8543.html')
        await page.goto(result[i].titleLink)
        const basekutu = await page.evaluate(() => {
                let kutu = {
                        artLy: null,
                        artmsg: null
                    }
                    // kutu['artLy'] = document.querySelector('.article .art_xin .art_ly span').innerHTML
                    // kutu['artmsg'] = document.querySelector('.article .air_con').innerHTML
                kutu['artLy'] = '网络'
                kutu['artmsg'] = document.querySelector('.viewbox .content').innerHTML
                return kutu
            })
            // console.log(basekutu)
        basekutu._id = result[i]._id
            // await updatemsg(basekutu, dbo)
            // dbo.collection('edu_class1_shuxuemsg').save(basekutu)
        dbo.collection('edu_class_msg').save(basekutu)
    }
    browser.close()
}