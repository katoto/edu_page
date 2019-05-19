// 年摘详情
const puppeteer = require('puppeteer')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://47.96.234.59:2710/'
// 2、查询数据
let selectData = function (db, callback) {
    //连接到表  
    var collection = db.collection('edu_zixun')
    //查询数据
    var whereStr = {};
    collection.find(whereStr).toArray(function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err
    var dbo = db.db('katoto')
    selectData(dbo, function (result) {

        var res = {
            artLy: '进击的巨人Attack on Titan 第三季',
            artmsg: `<p><strong>进击的巨人Attack on Titan第三季：玛利亚之墙最终夺回作战! 最新PART2播放地址</strong></p>
            <p><strong>进击的巨人Attack on Titan第三季：13集《初始的街道》播放地址</strong></p>
            <p><strong>进击的巨人Attack on Titan第三季：14集《雷枪》播放地址</strong></p>
            <p><strong>进击的巨人Attack on Titan第三季：15集《光临》播放地址</strong></p>
            <p>
              　　简介：世界突然出现了身长15公尺的迷之怪物「巨人」捕食着人类，面临着生存危机而残存下来的人类，建造了三重巨大防护墙在内侧以确保生活圈的安全，以及人类生命得延续，在这隔绝的环境里享受了一百年的和平，直到「超大型巨人」的出现。艾连・叶卡十岁那年、突然出现一个前所未见的「超大型巨人」，压倒性的力量破坏巨墙，其后瞬间消失，巨人们成群的冲进墙内进行人类捕食。艾连・叶卡看到了人们、伙伴、母亲先后被巨人杀死，怀着对巨人无以形容的恨意，誓言杀死全部巨人，母亲死亡、父亲失踪，其父可能掌握了巨人之谜，艾连・叶卡因父亲获得了巨人之力，在同期生里有着其他人无法比拟的强悍精神力，即使见过地狱也依然向巨人挑战，进而加入向往以久的调查兵团。
                <p>《进击的巨人》中不仅融入了悬疑、推理、青少年反乌托邦和政治惊悚等元素，还深刻地剖析了战争。画风精美,非常值得一看。</p>
              <p>风格：<strong>热血/奇幻/战斗</strong></p>
              <img
                src="//user-gold-cdn.xitu.io/2019/5/15/16abc024c45aa2b4?w=1210&h=910&f=png&s=863584"
                style="display: inline-block; width: 350px;"
              >&nbsp;&nbsp;&nbsp;&nbsp;
              <img
                src="//user-gold-cdn.xitu.io/2019/5/15/16abc0291ffa9897?w=1425&h=866&f=png&s=1189405"
                style="display: inline-block; width: 350px;"
              >
              <br />
              <br />
              <img
                src="//user-gold-cdn.xitu.io/2019/5/16/16abe96f5c6ea5e8?w=716&h=476&f=png&s=244823"
                style="display: inline-block; width: 350px;"
              >&nbsp;&nbsp;&nbsp;&nbsp;
              <img
                src="//user-gold-cdn.xitu.io/2019/5/16/16abe978c5f5120d?w=722&h=501&f=png&s=391726"
                style="display: inline-block; width: 350px;"
              >
              </p>
            <p><strong>进击的巨人第三季：<a target="_blank" href="//pan.baidu.com/s/1mtadkcE7f-nR7lxmchuTQA">13集《初始的街道》播放地址 </a>提取码：z5kn</strong></p>
            <p><strong>进击的巨人第三季：<a target="_blank" href="//yun.baidu.com/s/1MBDeLqP7qMTgkfxINXnqBQ">14集《雷枪》播放地址 </a>提取码：w6ns</strong></strong></p>
            <p><strong>进击的巨人第三季：<a target="_blank" href="//yun.baidu.com/s/1eJBaNtNTrHFDTJxlPiQv6Q">15集《光临》播放地址 </a>提取码：b5tb</strong></strong></p>
            <p>未完待续...</p>
            以上就是小编为大家带来的内容。
            </p>`,
            titleLink: '进击的巨人Attack on Titan第三季：玛利亚之墙最终夺回作战!',
            titleName: '进击的巨人Attack on Titan第三季：玛利亚之墙最终夺回作战!',
            titletime: '2019-05-16',
            _id: '201977/777777'
        }
        dbo.collection('edu_zixun').save(res)
        // getList(result, dbo)

    });
})
let getList = async (result, dbo) => {
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
let updatemsg = function (res, dbo) {
    dbo.collection('nianzhai_listmsg').save(res)
    // return new Promise((resolve, reject) => {
    //     dbo.collection('nianzhai_listmsg').save(res)
    //         // dbo.collection('edu_zixun').update({ "_id": res._id }, { $set: { artmsg: res.artmsg, artLy: res.artLy } }, function() {
    //         //     resolve(1)
    //         // })
    // })
}