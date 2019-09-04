// 这个每天会更新。
// 打喷嚏 的图挂展示。
// http://www.dapenti.com/blog/blog.asp?name=xilei&subjectid=70&page=1
// 详情
// http://www.dapenti.com/blog/more.asp?name=xilei&id=142898

const puppeteer = require('puppeteer')
let browser = null
let page = null

let getList = async () => {
    let kutuImg = []
    // 年摘
    browser = await (puppeteer.launch({
        ignoreHTTPSErrors: true,
        devtools: false,
        headless: false,
        args: ['--no-sandbox']
    }))
    page = await browser.newPage()
    await page.goto('http://www.dapenti.com/blog/blog.asp?name=xilei&subjectid=70&page=1')
    const basekutuImg = await page.evaluate(() => {
        let kutu = []
        document.querySelectorAll('.oblog_t_2 ul li').forEach((item, index) => {
          let currObj = {}
          let dom = item.querySelector('a')
          if(dom){
              currObj._id = dom.getAttribute('href').replace('more.asp?name=xilei&id=', '')
              currObj.titleLink = dom.getAttribute('href')
              currObj.titleLink = 'http://www.dapenti.com/blog/' + currObj.titleLink
              if(dom.innerHTML){
                currObj.title = dom.innerHTML.replace('喷嚏图卦', 'katoto图卦')
              }
          }
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
var url = 'mongodb://47.96.234.59:2710/'
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err
    var dbo = db.db('katoto')
    setTimeout(async () => {
        try {
            let backData = null;
            let currMsg = null;
            backData = await getList()
            for (let i = 0, len = backData.kutuImg.length; i < len; i++) {
                currMsg = backData.kutuImg[i]
                dbo.collection('dapenti').save(currMsg)
                // 取详情数据
                if (currMsg && currMsg.titleLink && i < 5) {
                    if (browser) {
                        const page = await browser.newPage()
                        await page.goto(currMsg.titleLink, {
                            timeout: 0
                        })
                        console.log(i)
                        const nianmsg = await page.evaluate(() => {
                            let kutu = {
                                artmsg: null
                            }
                            if (document.querySelector('div.oblog_text')) {
                                let currmsg = document.querySelector('div.oblog_text').innerHTML
                                kutu['artmsg'] = currmsg.replace(`<strong>免责声明：</strong>`, '')
                                  .replace(`以下内容，有可能引起内心冲突或愤怒等不适症状。若有此症状自觉被误导者，请绕行。若按捺不住看后症状特别明显，可自行前往CCAV等欢乐 频道进行综合调理。其余，概不负责 。`, '')
                                  .replace(`友情提示：请各位河蟹评论。道理你懂的`, '')
                                  .replace(`www.dapenti.com`, 'www.katoto.cn')
                                  .replace(`喷嚏网`, 'katoto网')
                                  .replace(`(海外访问，请加：<a href="http://www.dapenti.com/" target="_blank">http</a>)`, '')
                                  .replace(`友情提示：请各位河蟹评论。道理你懂的`, '')
                                  .replace(`喷嚏新浪围脖：<a href="http://weibo.com/u/5463797858" target="_blank">@喷嚏官微</a>&nbsp; 、<a href="http://weibo.com/2379450280" target="_blank">@ 喷嚏意图</a>（新浪）`, '')
                            }
                            return kutu
                        })
                        nianmsg._id = currMsg._id
                        dbo.collection('dapenti_msg').save(nianmsg)
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
        // }, 9200000)
    }, 0)
})