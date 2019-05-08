// 临时获取球员信息
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
    XLSX.writeFile(wb, `cricket.xlsx`)
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
    await page.goto('https://www.cricketworldcup.com/teams')
    // await page.goto('https://www.cricketworldcup.com/teams/afghanistan')
    const basekutuImg = await page.evaluate(() => {
        let kutu = []
        document.querySelectorAll('.team-index__list .team-index__list-item').forEach((item, index) => {
            let currObj = {}
            currObj.link = item.querySelector('.team-index__link').getAttribute('href')
            currObj.teamName = item.querySelector('.team-index__item-header .team-index__item-team .team-index__item-nation').innerHTML
            currObj.ranking = item.querySelector('.team-index__team-info .team-index__stat').innerHTML
            console.log(currObj)
            kutu.push(currObj)
        })
        return kutu
    })
    let allData = []
    for (let i = 0, len = basekutuImg.length; i < len; i++) {
        currMsg = basekutuImg[i]
            // 取详情数据
        if (currMsg && currMsg.link) {
            if (browser) {
                page = await browser.newPage()
                await page.goto('https://www.cricketworldcup.com' + currMsg.link, {
                    timeout: 0
                })
                const nianmsg = await page.evaluate(() => {
                    let kutu = []
                    document.querySelectorAll('.squad-list__list .squad-list__list-item').forEach((item, index) => {
                        let currObj = {}
                        currObj.listName = item.querySelector('.squad-list__details .squad-list__name').innerHTML.replace('<span class="squad-list__last-name">', '').replace('</span>', '')
                        if(item.querySelector('.squad-list__details .squad-list__role')){
                            currObj.position = item.querySelector('.squad-list__details .squad-list__role').innerHTML.replace('<svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/resources/ver/i/svg-output/icons.svg#icn-cricket-bat"></use></svg>', '').replace('<span class="squad-list__captain-marker u-show-tablet">C</span>', '').replace(/^\s+|\s+$/g, '')
                        }else{
                            currObj.position = ''
                        }
                        currObj.index = index + 1
                        console.log(currObj)
                        kutu.push(currObj)
                    })
                    return kutu
                })
                nianmsg.forEach((item, index)=>{
                    item.countryName = currMsg.teamName
                    item.ranking = currMsg.ranking
                })
                allData = allData.concat(nianmsg)
                // 这个是数组
                console.log(allData)  
            }
        }
    }
    downDemo(allData)
    // kutuImg = kutuImg.concat(basekutuImg)
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