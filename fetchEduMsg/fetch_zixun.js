const puppeteer = require('puppeteer')
let getList = async () => {
    const browser = await (puppeteer.launch({
        ignoreHTTPSErrors: true,
        devtools: false,
        headless: false,
        args: ['--no-sandbox']
    }))
    let kutuImg = []
    for (let i = 0; i < 1; i++) {
        const page = await browser.newPage()
<<<<<<< HEAD
            // 新东方咨询
        await page.goto('http://xiaoxue.xdf.cn/list_1266_1.html')
=======
        // 一年级数学
        // await page.goto('http://xiaoxue.xdf.cn/list_1266_1.html')
        await page.goto('http://xiaoxue.xdf.cn/list_1266_2.html')
>>>>>>> bc49df8f02dae8be3c5c597879fd8358e68745b0
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
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err
    var dbo = db.db('katoto')
    setTimeout(async () => {
        let backData = null
        backData = await getList()
        backData.kutuImg.forEach((item, index) => {
            dbo.collection('edu_zixun').save(item)
        })
    }, 1000)
})