// 这个每天会更新。 shibei 表处
// 打喷嚏 的图挂展示。
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

// "mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority";
const uri = toolConfig.mongodbUrl || "mongodb://47.96.234.59:2710/";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db(toolConfig.dbName || "admin");
    const collTable = database.collection("dapenti");
    let backData = null;
    let currMsg = null;
    backData = await getList();
    console.log("==list 11==");

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
              //   kutu["artmsg"] = currmsg
              //     .replace(`<strong>免责声明：</strong>`, "")
              //     .replace(
              //       `以下内容，有可能引起内心冲突或愤怒等不适症状。若有此症状自觉被误导者，请绕行。若按捺不住看后症状特别明显，可自行前往CCAV等欢乐 频道进行综合调理。其余，概不负责 。`,
              //       ""
              //     )
              //     .replace(`友情提示：请各位河蟹评论。道理你懂的`, "")
              //     .replace(`www.dapenti.com`, "www.katoto.cn")
              //     .replace(`喷嚏网`, "katoto网")
              //     .replace(
              //       `(海外访问，请加：<a href="http://www.dapenti.com/" target="_blank">http</a>)`,
              //       ""
              //     )
              //     .replace(`友情提示：请各位河蟹评论。道理你懂的`, "")
              //     .replace(
              //       `喷嚏新浪围脖：<a href="http://weibo.com/u/5463797858" target="_blank">@喷嚏官微</a>&nbsp; 、<a href="http://weibo.com/2379450280" target="_blank">@ 喷嚏意图</a>（新浪）`,
              //       ""
              //     );
            }
            return kutu;
          });
          currMsg.content = nianmsg.artmsg;
          console.log(currMsg);
          await collTable.updateOne(
            {
              _id: currMsg._id,
            },
            {
              $set: currMsg,
            }
          );
        }
      }
    }
    // await collTable.insertMany(backData.kutuImg, {
    //   ordered: false,
    // });
    console.log("==list ok==");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    // process.exit(1);
  }
}

run().catch(console.dir);

// MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
//   if (err) throw err;
//   console.log(toolConfig.dbName);
//   console.log(toolConfig.mongodbUrl);
//   const dbo = db.db(toolConfig.dbName || "admin");
//   setTimeout(async () => {
//     try {
//       let backData = null;
//       let currMsg = null;
//       backData = await getList();

//       console.log(backData[0]);
//       dbo.collection("test").save({
//         a: 1111,
//         b: "3223",
//       });
//       console.log("======11====");

// for (let i = 0, len = backData.kutuImg.length; i < len; i++) {
//   currMsg = backData.kutuImg[i];
//   dbo.collection("dapenti").save(currMsg);
//   // 取详情数据
//   if (currMsg && currMsg.titleLink && i < 5) {
//     if (browser) {
//       const page = await browser.newPage();
//       await page.goto(currMsg.titleLink, {
//         timeout: 0,
//       });
//       console.log(i);
//       const nianmsg = await page.evaluate(() => {
//         let kutu = {
//           artmsg: null,
//         };
//         if (document.querySelector("div.oblog_text")) {
//           let currmsg = document.querySelector("div.oblog_text").innerHTML;
//           kutu["artmsg"] = currmsg
//             .replace(`<strong>免责声明：</strong>`, "")
//             .replace(
//               `以下内容，有可能引起内心冲突或愤怒等不适症状。若有此症状自觉被误导者，请绕行。若按捺不住看后症状特别明显，可自行前往CCAV等欢乐 频道进行综合调理。其余，概不负责 。`,
//               ""
//             )
//             .replace(`友情提示：请各位河蟹评论。道理你懂的`, "")
//             .replace(`www.dapenti.com`, "www.katoto.cn")
//             .replace(`喷嚏网`, "katoto网")
//             .replace(
//               `(海外访问，请加：<a href="http://www.dapenti.com/" target="_blank">http</a>)`,
//               ""
//             )
//             .replace(`友情提示：请各位河蟹评论。道理你懂的`, "")
//             .replace(
//               `喷嚏新浪围脖：<a href="http://weibo.com/u/5463797858" target="_blank">@喷嚏官微</a>&nbsp; 、<a href="http://weibo.com/2379450280" target="_blank">@ 喷嚏意图</a>（新浪）`,
//               ""
//             );
//         }
//         return kutu;
//       });
//       nianmsg._id = currMsg._id;
//       dbo.collection("dapenti_msg").save(nianmsg);
//     }
//   }
// }
//     } catch (e) {
//       console.log("error at catch");
//       console.log(e);
//     }
//     browser.close();
//     console.log("ending");
//     console.log(new Date().getDate());
//     //   }, 9500000)
//   }, 0);
// });
