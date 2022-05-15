// 这个每天会更新。 shibei 表处
// https://www.bohaishibei.com/post/category/main/
// 详情
// https://www.bohaishibei.com/post/73353/

const puppeteer = require("puppeteer");
const toolConfig = require("../../config");
const { MongoClient } = require("mongodb");

let browser = null;
let page = null;

let getList = async () => {
  let kutuImg = [];
  // 年摘
  browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    devtools: false,
    headless: true,
    args: ["--no-sandbox"],
  });
  page = await browser.newPage();
  await page.goto("https://www.bohaishibei.com/post/category/main/");
  const basekutuImg = await page.evaluate(() => {
    // 处理时间
    function handleTime(str = "2022年3月5日") {
      const nStr = str.replace(/([年月日])/g, "-");
      const strArr = nStr.split("-");
      const nStrArr = strArr.map((val) => {
        if (+val <= 9) {
          return 0 + val;
        }
        return val;
      });
      return nStrArr.join("");
    }
    let kutu = [];
    document
      .querySelectorAll("#recent-content>.category-main")
      .forEach((item, index) => {
        let currObj = {};
        currObj.funnyId = currObj._id = item
          .getAttribute("id")
          .replace("post-", "");
        currObj.titleLink = item
          .querySelector(".thumbnail-link")
          .getAttribute("href");
        let currCont = item.querySelector(".thumbnail-wrap>img");
        currObj.title = currCont
          .getAttribute("alt")
          .replace("博海拾贝", "katoto资讯");
        currObj.sortTime = handleTime(
          item.querySelector(".entry-date").innerHTML.replace(/ /g, "")
        );
        currObj.subCont = item
          .querySelector(".entry-summary")
          .innerHTML.replace(/ /g, "");
        console.log(currObj);
        kutu.push(currObj);
      });
    return kutu;
  });
  kutuImg = kutuImg.concat(basekutuImg);
  return {
    kutuImg,
  };
};

// "mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority";
const uri = toolConfig.mongodbUrl || "mongodb://47.96.234.59:2710/";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db(toolConfig.dbName || "admin");
    const collTable = database.collection("article_shibei");
    let backData = null;
    let currMsg = null;
    backData = await getList();

    for (let i = 0, len = backData.kutuImg.length; i < len; i++) {
      currMsg = backData.kutuImg[i];
      // 取详情数据
      if (currMsg && currMsg.titleLink && i < 5) {
        if (browser) {
          const page = await browser.newPage();
          await page.goto(currMsg.titleLink, {
            timeout: 0,
          });
          console.log(i);
          const nianmsg = await page.evaluate(() => {
            let kutu = {
              artmsg: "",
            };
            const blogDoms = document.querySelectorAll(
              "#main .entry-content>p"
            );
            if (blogDoms && blogDoms.length > 0) {
              let pArr = Array.from(blogDoms);
              pArr = pArr.filter((item) => {
                if (item && item.innerHTML) {
                  const innerVal = item.innerHTML;
                  // 过滤dom
                  if (
                    innerVal.includes(
                      "https://tva1.sinaimg.cn/mw690/69bbca83gy1g6fknjsyxmj20g90au75g.jpg"
                    ) ||
                    innerVal.includes(
                      "https://tva1.sinaimg.cn/mw690/69bbca83ly1g6fkp31dskj20qp0zdgn6.jpg"
                    ) ||
                    innerVal.includes("博海拾贝出品，每日轻拾一贝") ||
                    innerVal.includes("添加梁萧微信")
                  ) {
                    return false;
                  }
                  return true;
                }
                return false;
              });
              const nArr = pArr.map((item) => {
                if (item && item.innerHTML) {
                  const nHTML = item.innerHTML.replace(/\t|\n/g, "");
                  return nHTML ? `<p>${nHTML}</p>` : "";
                }
                return "";
              });
              const nStrs = nArr.join("");
              kutu["artmsg"] = nStrs;
            }
            return kutu;
          });
          currMsg.content = nianmsg.artmsg;
          const isFind = await collTable.findOne({ _id: currMsg._id });
          if (isFind) {
            // 新增
            await collTable.updateOne(
              {
                _id: currMsg._id,
              },
              {
                $set: currMsg,
              }
            );
          } else {
            // 插入
            await collTable.insertOne(currMsg);
          }
        }
      }
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    process.exit(1);
  }
}

run().catch(console.dir);
