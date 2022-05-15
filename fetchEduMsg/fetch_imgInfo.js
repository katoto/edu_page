/**
 * 
 * [每日博海拾贝]
 * https://www.bohaishibei.com/post/category/main/
 */

const puppeteer = require("puppeteer");
let getList = async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    devtools: false,
    headless: false,
    args: ["--no-sandbox"],
  });
  let kutuImg = [];
  for (let i = 0; i < 5; i++) {
    const page = await browser.newPage();
    // 一年级语文
    await page.goto(
      "http://www.dlrzy.com/a/xiaoxueyinian/yuwen/list_28_" + (i + 1) + ".html"
    );
    // 一年级英语

    const basekutuImg = await page.evaluate(() => {
      let kutu = [];
      document
        .querySelectorAll(".pleft .listbox .e2 li")
        .forEach((item, index) => {
          let currObj = {};
          let baseid = null;
          // 数学1
          // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueyinian/shuxue_yuwen_yingyu/', '')
          // 英语1
          // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueyinian/yingyu/', '')
          // 语文1
          baseid = item
            .querySelector(".title")
            .getAttribute("href")
            .replace("http://www.dlrzy.com/a/xiaoxueyinian/yuwen/", "");
          // 数学2
          // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueernian/shuxue_yuwen_yingyu/', '')
          // 英语2
          // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueernian/yingyu', '')
          // 语文2
          // baseid = item.querySelector('.title').getAttribute('href').replace('http://www.dlrzy.com/a/xiaoxueernian/yuwen/', '')

          currObj._id = baseid.replace(".html", "");
          currObj.titleLink = item.querySelector(".title").getAttribute("href");
          currObj.titleName = item.querySelector(".title").innerHTML;
          currObj.intro = item.querySelector(".intro").innerHTML;
          kutu.push(currObj);
        });
      return kutu;
    });
    kutuImg = kutuImg.concat(basekutuImg);
  }
  console.log(kutuImg.length);
  console.log("===========");
  console.log(kutuImg);
  browser.close();
  return {
    kutuImg,
  };
};

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://47.96.234.59:27017/";
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  var dbo = db.db("katoto");
  setTimeout(async () => {
    let backData = null;
    backData = await getList();
    backData.kutuImg.forEach((item, index) => {
      // dbo.collection('edu_class1_shuxue').save(item)
      dbo.collection("edu_class1_yuwen").save(item);
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
    });
  }, 1000);
});
