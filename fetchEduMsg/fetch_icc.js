// 每天更新
const puppeteer = require('puppeteer')
let browser = null
let page = null

const XLSX = require('xlsx')

function downDemo(arr){
    let ws
    let wb
    /* 创建worksheet */
    ws = XLSX.utils.json_to_sheet(arr)
    /* 新建空workbook，然后加入worksheet */
    wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "language")
    /* 生成xlsx文件 */
    XLSX.writeFile(wb, `ICC.xlsx`)
}



let getList = async() => {
    browser = await (puppeteer.launch({
        ignoreHTTPSErrors: true,
        devtools: false,
        headless: false,
        timeout: 1000000,
        slowMo: 200,
        args: ['--no-sandbox']
    }))
    let kutuImg = []
    page = await browser.newPage()
    // 小学资讯
    await page.goto('file:///C:/Users/Administrator/Desktop/Google%20Search.mhtml')
    const basekutuImg = await page.evaluate(() => {
        let kutu = []
        document.querySelectorAll('.OcbAbf').forEach((item, index) => {
            
            let bodyLenDom = item.querySelectorAll('.liveresults-sports-immersive__match-tile')
            if(bodyLenDom){
                bodyLenDom.forEach((newList, index)=>{
                    let currObj = {}
                    currObj.top_img = newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__lc-sbt img')[0].getAttribute('src')
                    if(newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ta-c .ellipsisize').length>0 && newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ta-c .ellipsisize')[0].querySelector('span')){
                        if(newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ta-c .ellipsisize').length>0 && newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ta-c .ellipsisize')[0]){
                            currObj.top_name = newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ta-c .ellipsisize')[0].querySelector('span').innerHTML
                        }
                    }
                    if(newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ws-c .imspo_mt__t-sc').length>0){
                        if(newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ws-c .imspo_mt__t-sc')[0].querySelector('.imspo_mt__tt-w')){
                            currObj.top_score = newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ws-c .imspo_mt__t-sc')[0].querySelector('.imspo_mt__tt-w').innerText
                        }
                    }else {
                        currObj.top_score = 'nomsg'
                    }
                    
                    currObj.bottom_img = newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__lc-sbt img')[1].getAttribute('src')
                    if(newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ta-c .ellipsisize').length>0 && newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ta-c .ellipsisize')[1].querySelector('span')){
                        currObj.bottom_name = newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ta-c .ellipsisize')[1].querySelector('span').innerHTML
                    }
                    if(newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ws-c .imspo_mt__t-sc').length>0){
                        if(newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ws-c .imspo_mt__t-sc')[1].querySelector('.imspo_mt__tt-w')){
                            currObj.bottom_score = newList.querySelectorAll('.imspo_mt__mit .imspo_mt__tr .imspo_mt__tns-c .imspo_mt__ws-c .imspo_mt__t-sc')[1].querySelector('.imspo_mt__tt-w').innerText
                        }
                    }else {
                        currObj.bottom_score = 'nomsg'
                    }
                    
                    kutu.push(currObj)
                })
            }

            
            
            
            
        })
        return kutu
    })
    console.log(basekutuImg.length)
    console.log(basekutuImg[0])
    console.log(basekutuImg)
    downDemo(basekutuImg)
    kutuImg = kutuImg.concat(basekutuImg)
    return {
        kutuImg
    }
}


setTimeout(async() => {
    try {
        backData = await getList()
    } catch (e) {
        console.log('error at catch')
        console.log(e)
    }
    browser.close()
// }, 9900000)
}, 0)

// var MongoClient = require('mongodb').MongoClient
// var url = 'mongodb://47.96.234.59:2710/'
// MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
//     if (err) throw err
//     var dbo = db.db('katoto')

// })
