// 这个每天会更新。 dapenti 表处
// 打喷嚏 的图挂展示。
// http://www.dapenti.com/blog/blog.asp?name=xilei&subjectid=70&page=1
// 详情
// http://www.dapenti.com/blog/more.asp?name=xilei&id=142898

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
  await page.goto(
    "http://www.dapenti.com/blog/blog.asp?name=xilei&subjectid=70&page=1"
  );
  const basekutuImg = await page.evaluate(() => {
    let kutu = [];
    document.querySelectorAll(".oblog_t_2 ul li").forEach((item, index) => {
      let currObj = {};
      let dom = item.querySelector("a");
      if (dom) {
        currObj.funnyId = currObj._id = dom
          .getAttribute("href")
          .replace("more.asp?name=xilei&id=", "");
        currObj.titleLink = dom.getAttribute("href");
        currObj.titleLink = "http://www.dapenti.com/blog/" + currObj.titleLink;
        let currVal = dom.innerHTML;
        if (currVal) {
          currObj.title = currVal.replace("喷嚏图卦", "katoto图卦");
          currObj.sortTime = currObj.title.slice(9, 17);
        }
      }
      kutu.push(currObj);
    });
    return kutu;
  });
  kutuImg = kutuImg.concat(basekutuImg);
  return {
    kutuImg,
  };
};

const uri = toolConfig.mongodbUrl || "mongodb://47.96.234.59:2710/";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db(toolConfig.dbName || "admin");
    const collTable = database.collection("article_dapenti");
    let backData = null;
    let currMsg = null;
    backData = await getList();
    console.log("==list start==");

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
              artmsg: "1",
            };
            const blogDoms = document.querySelectorAll(
              "td.oblog_t_2>div>table>tbody>tr>td:not(.oblog_t_4)>p"
            );
            if (blogDoms && blogDoms.length > 0) {
              let pArr = Array.from(blogDoms);
              pArr = pArr.filter((item) => {
                if (item && item.innerHTML) {
                  const innerVal = item.innerHTML;
                  // 过滤dom
                  if (
                    innerVal === "&nbsp;" ||
                    innerVal === "广告" ||
                    innerVal.includes("本期图卦由") ||
                    innerVal.includes("喷嚏优选") ||
                    innerVal.includes("喷嚏网") ||
                    innerVal.includes("无需App在移动设备上") ||
                    innerVal.includes("欢迎转载，转载请保证原文的完整性") ||
                    innerVal.includes("喷嚏新浪围脖") ||
                    innerVal.includes("@喷嚏官微") ||
                    innerVal.includes(
                      "以下内容，有可能引起内心冲突或愤怒等不适症状"
                    )
                  ) {
                    return false;
                  }
                  return true;
                }
                return false;
              });
              const nArr = pArr.map((item) => {
                if (item && item.innerHTML) {
                  const nHTML = item.innerHTML
                    .replace(/\t|\n|广告|&nbsp;/g, "")
                    .replace(`友情提示：请各位河蟹评论。道理你懂的`, "")
                    .replace(`www.dapenti.com`, "www.katoto.cn")
                    .replace(
                      `(海外访问，请加：<a href="http://www.dapenti.com/" target="_blank">http</a>)`,
                      ""
                    )
                    .replace(
                      `喷嚏新浪围脖：<a href="http://weibo.com/u/5463797858" target="_blank">@喷嚏官微</a>&nbsp; 、<a href="http://weibo.com/2379450280" target="_blank">@ 喷嚏意图</a>（新浪）`,
                      ""
                    );
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

    console.log("==list ok==");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    process.exit(1);
  }
}

run().catch(console.dir);
