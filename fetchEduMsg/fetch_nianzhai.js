// 这个每天会更新。
const puppeteer = require('puppeteer')
let getList = async() => {
    const browser = await (puppeteer.launch({
        ignoreHTTPSErrors: true,
        devtools: false,
        headless: false,
        args: ['--no-sandbox']
    }))
    let kutuImg = []
    for (let i = 1; i < 6; i++) {
        const page = await browser.newPage()
            // 一年级数学
        await page.goto('http://qingniantuzhai.com/page/' + i + '/')
        const basekutuImg = await page.evaluate(() => {
            let kutu = []
            document.querySelectorAll('.ajax-load-box .content-box').forEach((item, index) => {
                let currObj = {}
                let baseid = null
                currObj._id = item.querySelector('.posts-gallery-img a').getAttribute('href')
                currObj.titleLink = currObj._id
                currObj.img = item.querySelector('.posts-gallery-img a img').getAttribute('data-original')
                currObj.titleName = item.querySelector('.posts-gallery-content h2 a').innerHTML
                currObj.baseDesc = item.querySelector('.posts-gallery-content .posts-gallery-text').innerHTML
                currObj.titletime = item.querySelector('.posts-gallery-content .posts-gallery-info .ico-time').innerHTML
                currObj.author = item.querySelector('.posts-gallery-content .posts-gallery-info .post-author a').innerHTML
                kutu.push(currObj)
            })
            return kutu
        })
        kutuImg = kutuImg.concat(basekutuImg)
    }
    console.log(kutuImg.length)
    console.log('===========')
    console.log(kutuImg)
    browser.close()
    return {
        kutuImg
    }
}

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://47.96.234.59:27017/'
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err
    var dbo = db.db('katoto')
    setTimeout(async() => {
        let backData = null
        backData = await getList()
        console.log(backData)
        backData.kutuImg.forEach((item, index) => {
            dbo.collection('nianzhai_list').save(item)
        })
    }, 1000)
})