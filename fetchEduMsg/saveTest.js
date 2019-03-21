// 年摘详情
const puppeteer = require('puppeteer')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://47.96.234.59:27017/'
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
            artLy: '今日头条邀请',
            artmsg: `<p><strong>今日头条极速版邀请码：CJ8L4QKV 最新2019今日头条极速版邀请码，有三元，看新闻、看资讯赚钱。</strong></p> <p>
              　　现在<strong>看新闻赚零花钱</strong>的手机软件越来越多，许多知名互联网公司也纷纷加入，像：搜狐、凤凰新闻等。今日头条也砸钱加入了这一行列。经实测，使用今日头条极速版填写我的邀请码 <strong> CJ8L4QKV </strong> 确实可以得到三元现金红包，可以直接提现，目前小伙伴们已经通过我的邀请码得到了现金红包了，大家去速度参与！下图是我的收益，快快复制试一试：
              <img src="//user-gold-cdn.xitu.io/2019/3/21/169a0bca0bc139c5?w=750&amp;h=1334&amp;f=jpeg&amp;s=70812" style="display: inline-block; width: 340px;">&nbsp;&nbsp;&nbsp;&nbsp;
              <img src="//user-gold-cdn.xitu.io/2019/3/21/169a0bc525a2608b?w=750&amp;h=1334&amp;f=jpeg&amp;s=67674" style="display: inline-block; width: 340px;"></p> <p>
              　　今日头条凭借着“你关心的，才是头条”这一重大创新，将资讯推荐的智能引擎发挥到了极致，同时也俘获了亿级的用户，<strong>头条系产品与腾讯战火再起</strong>, 让今日头条APP成为移动互联网时代资讯类APP。以前都是人找资讯，在这个信息大爆炸的时代，已经成为了资讯“找”人，使用今日头条APP，会根据你的阅读习惯给你智能推荐你关心的资讯信息，也就是说你打开今日头条，看到的都是你想看的。今日头条非常好用，小编已经卸载掉了新浪新闻那些“传统”的新闻APP，不过小编也发现更好的今日头条APP，那就是今日头条极速版，看新闻、看资讯赚钱。
            </p> <p>
              　　今日头条极速版是什么？其实就是今日头条的简化版，去除了很多冗余的功能，让我们看新闻资讯更加流畅。同时还增加了一个赚钱的功能，同样都是看新闻，使用今日头条极速版还能赚金币，金币就可以直接兑换成钱。不知道大家发现没有，使用今日头条极速版的时候，有一个输入邀请码的地方，而且输入就能直接得到3元现金，快快扫描下图二维码！

              <img src="//user-gold-cdn.xitu.io/2019/3/21/169a0bc893dfc6f2?w=750&amp;h=1334&amp;f=jpeg&amp;s=105831" style="display: inline-block; width: 340px;"> <img src="//user-gold-cdn.xitu.io/2019/3/21/169a0bc6f39450f8?w=750&amp;h=1334&amp;f=jpeg&amp;s=85558" style="display: inline-block; width: 340px;"></p> <p>
              点击进入【任务列表】，找到【输入邀请码】。直接填写 <strong> CJ8L4QKV </strong> 即可获得3元现金奖励。
            </p> <p>
              为什么输入邀请码提示错误？提示邀请码输入错误可能由以下原因造成：
              <ul style="padding-left: 36px;"><li> 1、好友未正确输入您分享的邀请码；</li> <li> 2、本人输入了自己的邀请码；</li> <li> 3、您邀请的徒弟未在使用新手机和新帐号的10天内输入邀请码；</li> <li>4、您邀请的好友已经跟其他用户有了师徒关系。</li></ul></p> <p><strong>今日头条极速版填写邀请码的步骤：</strong> <ul style="padding-left: 36px;"><li> 1、若是想在今日头条极速版里面填写邀请码<strong> CJ8L4QKV </strong>，大家需要从主页的右下角点击任务按钮，进入任务中心，从列表里找到“输入邀请码”的功能。<br> <img src="//www.haotui.net/res/2018/12-14/21/a49dedea7ac7cea928aba8e0af890d6b.png" style="display: inline-block; width: 340px;">&nbsp;&nbsp;&nbsp;&nbsp;
                  <img src="//www.haotui.net/res/2018/12-01/21/2eee0844e456a13d5a994555b48bfb46.png" style="display: inline-block; width: 340px;"></li> <li> 2、进入到输入邀请码的页面之后，填写邀请码<strong> CJ8L4QKV </strong>进行提交，就可以成功领取3元红包了。</li> <li> 3、对此感兴趣的朋友还可以通过“邀请好友”功能复制自己的邀请码，让其他人注册今日头条极速版并填写邀请码，就可以获得现金收益哦!</li></ul>
              以上就是小编为大家带来的额外收入的内容。
            </p>`,
            titleLink: 'CJ8L4QKV 最新2019今日头条极速版邀请码',
            titleName: 'CJ8L4QKV 最新2019今日头条极速版邀请码 看新闻、看资讯赚钱',
            titletime: '2019-03-21',
            _id: '201988/888888'
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