// 这个每天会更新。
const puppeteer = require('puppeteer')
let browser = null
let page = null

let getList = async() => {
    let kutuImg = []
        // 一年级数学
    browser = await (puppeteer.launch({
        ignoreHTTPSErrors: true,
        devtools: false,
        headless: false,
        args: ['--no-sandbox']
    }))
    page = await browser.newPage()
    await page.goto('http://qingniantuzhai.com/page/1/')
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
        let backData = null;
        let currMsg = null;
        backData = await getList()
        for (let i = 0, len = backData.kutuImg.length; i < len; i++) {
            currMsg = backData.kutuImg[i]
            dbo.collection('nianzhai_list').save(currMsg)
                // 取详情数据
            if (currMsg && currMsg.titleLink && i < 3) {
                const page = await browser.newPage()
                await page.goto('https://qingniantuzhai.com' + currMsg.titleLink, {
                    timeout: 120000
                })
                const nianmsg = await page.evaluate(() => {
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
                nianmsg._id = currMsg._id
                dbo.collection('nianzhai_listmsg').save(nianmsg)
            }
        }
        browser.close()
    }, 1000)
})