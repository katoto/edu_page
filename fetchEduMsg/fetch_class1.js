// 所有年级列表获取
const puppeteer = require('puppeteer')
let getList = async() => {
    const browser = await (puppeteer.launch({
        ignoreHTTPSErrors: true,
        devtools: false,
        headless: false,
        args: ['--no-sandbox']
    }))
    let kutuImg = []
    for (let i = 0; i < 5; i++) {
        const page = await browser.newPage()
            // 一年级数学
            // await page.goto('http://www.dlrzy.com/a/xiaoxueyinian/shuxue_yuwen_yingyu/list_3_' + (i + 1) + '.html')
            // 一年级语文
        await page.goto('http://www.dlrzy.com/a/xiaoxueyinian/yuwen/list_28_' + (i + 1) + '.html')
            // 一年级英语
            // await page.goto('http://www.dlrzy.com/a/xiaoxueyinian/yingyu/list_17_' + (i + 1) + '.html')
            // 二年级数学
            // await page.goto('http://www.dlrzy.com/a/xiaoxueernian/shuxue_yuwen_yingyu/list_5_' + (i + 1) + '.html')
            // await page.goto('http://www.dlrzy.com/a/xiaoxueernian/yuwen/list_18_' + (i + 1) + '.html')
            // await page.goto('http://www.dlrzy.com/a/xiaoxueernian/yingyu/list_19_' + (i + 1) + '.html')

        // await page.goto('http://www.dlrzy.com/a/xiaoxuesannian/shuxue_yuwen_yingyu/list_7_' + (i + 1) + '.html')
        // await page.goto('http://www.dlrzy.com/a/xiaoxuesannian/yingyu/list_21_' + (i + 1) + '.html')
        // await page.goto('http://www.dlrzy.com/a/xiaoxuesannian/yuwen/list_20_' + (i + 1) + '.html')

        // await page.goto('http://www.dlrzy.com/a/xiaoxuesinian/shuxue_yuwen_yingyu/list_9_' + (i + 1) + '.html')
        // await page.goto('http://www.dlrzy.com/a/xiaoxuesinian/yingyu/list_23_' + (i + 1) + '.html')
        // await page.goto('http://www.dlrzy.com/a/xiaoxuesinian/yuwen/list_22_' + (i + 1) + '.html')

        // await page.goto('http://www.dlrzy.com/a/xiaoxuewunian/shuxue_yuwen_yingyu/list_11_' + (i + 1) + '.html')
        // await page.goto('http://www.dlrzy.com/a/xiaoxuewunian/yingyu/list_25_' + (i + 1) + '.html')
        // await page.goto('http://www.dlrzy.com/a/xiaoxuewunian/yuwen/list_24_' + (i + 1) + '.html')
        // 6
        // await page.goto('http://www.dlrzy.com/a/xiaoxueliunian/shuxue_yuwen_yingyu/list_13_' + (i + 1) + '.html')
        // await page.goto('http://www.dlrzy.com/a/xiaoxueliunian/yingyu/list_27_' + (i + 1) + '.html')
        // await page.goto('http://www.dlrzy.com/a/xiaoxueliunian/yuwen/list_26_' + (i + 1) + '.html')

        const basekutuImg = await page.evaluate(() => {
            let kutu = []
            document.querySelectorAll('.pleft .listbox .e2 li').forEach((item, index) => {
                let currObj = {}
                let baseid = null
                    // 数学1
                    // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueyinian/shuxue_yuwen_yingyu/', '')
                    // 英语1
                    // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueyinian/yingyu/', '')
                    // 语文1
                baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueyinian/yuwen/', '')
                    // 数学2
                    // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueernian/shuxue_yuwen_yingyu/', '')
                    // 英语2
                    // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueernian/yingyu', '')
                    // 语文2
                    // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueernian/yuwen/', '')

                // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxuesannian/shuxue_yuwen_yingyu/', '')
                // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxuesannian/yingyu/', '')
                // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxuesannian/yuwen/', '')

                // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxuesinian/shuxue_yuwen_yingyu/', '')
                // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxuesinian/yingyu/', '')
                // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxuesinian/yuwen/', '')

                // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueliunian/shuxue_yuwen_yingyu/', '')
                // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueliunian/yuwen/', '')
                // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueliunian/yingyu/', '')

                currObj._id = baseid.replace('.html', '')
                currObj.titleLink = item.querySelector('.title').getAttribute('href')
                currObj.titleName = item.querySelector('.title').innerHTML
                currObj.intro = item.querySelector('.intro').innerHTML
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
        backData.kutuImg.forEach((item, index) => {
            // dbo.collection('edu_class1_shuxue').save(item)
            dbo.collection('edu_class1_yuwen').save(item)
                // dbo.collection('edu_class1_yingyu').save(item)
                // dbo.collection('edu_class2_shuxue').save(item)
                // dbo.collection('edu_class2_yuwen').save(item)
                // dbo.collection('edu_class2_yingyu').save(item)
                // dbo.collection('edu_class3_shuxue').save(item)
                // dbo.collection('edu_class3_yuwen').save(item)
                // dbo.collection('edu_class3_yingyu').save(item)
                // dbo.collection('edu_class4_shuxue').save(item)
                // dbo.collection('edu_class4_yuwen').save(item)
                // dbo.collection('edu_class4_yingyu').save(item)
                // dbo.collection('edu_class5_shuxue').save(item)
                // dbo.collection('edu_class5_yuwen').save(item)
                // dbo.collection('edu_class5_yingyu').save(item)
                // dbo.collection('edu_class6_shuxue').save(item)
                // dbo.collection('edu_class6_yuwen').save(item)
                // dbo.collection('edu_class6_yingyu').save(item)
        })
    }, 1000)
})