// 每天更新
const puppeteer = require('puppeteer')
let browser = null
let page = null

let getList = async() => {
    browser = await (puppeteer.launch({
        ignoreHTTPSErrors: true,
        devtools: false,
        headless: false,
        args: ['--no-sandbox']
    }))
    let kutuImg = []
    page = await browser.newPage()
    // 小学资讯
    await page.goto('http://xiaoxue.xdf.cn/list_1266_1.html')
    const basekutuImg = await page.evaluate(() => {
        let kutu = []
        document.querySelectorAll('#li_list li').forEach((item, index) => {
            let currObj = {}
            let baseid = null
            if (!item.querySelector('a')) return false
            baseid = item.querySelector('a').getAttribute('href').replace('http://xiaoxue.xdf.cn/', '')
            currObj._id = baseid.replace('.html', '')
            currObj.titleLink = item.querySelector('a').getAttribute('href')
            currObj.titleName = item.querySelector('a').innerHTML
            currObj.titletime = item.querySelector('.time').innerHTML
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
    setInterval(async() => {
        try {
            let backData = null;
            let currMsg = null;
            backData = await getList()
            for (let i = 0, len = backData.kutuImg.length; i < len; i++) {
                currMsg = backData.kutuImg[i]
                    // 取详情数据
                if (currMsg && currMsg.titleLink && i < 12) {
                    if (browser) {
                        page = await browser.newPage()
                        await page.goto(currMsg.titleLink, {
                            timeout: 0
                        })
                        const nianmsg = await page.evaluate(() => {
                            let kutu = {
                                artLy: null,
                                artmsg: null
                            }
                            kutu['artLy'] = document.querySelector('.article .art_xin .art_ly span').innerHTML
                            kutu['artmsg'] = document.querySelector('.article .air_con').innerHTML
                            return kutu
                        })
                        currMsg.artLy = nianmsg.artLy
                        currMsg.artmsg = nianmsg.artmsg
                        dbo.collection('edu_zixun').save(currMsg)
                    }
                }
            }
        } catch (e) {
            console.log('error at catch')
            console.log(e)
        }
        browser.close()
        console.log('ending')
        console.log(new Date().getDate())
    }, 9900000)
    // }, 0)
})
