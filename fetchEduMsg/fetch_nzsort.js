// 年摘 按时间进行排序  小 =》 大
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://47.96.234.59:27017/'
    // 2、查询数据
let selectData = function(db, callback) {
    //连接到表  
    var collection = db.collection('test')
        //查询数据
    var whereStr = {};
    collection.find(whereStr).toArray(function(err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err
    var dbo = db.db('katoto')
    selectData(dbo, function(result) {
        getList(result, dbo)
    });
})
let getList = async(result, dbo) => {
    console.log(result.length)
    let barArr = []
    for (let i = 0, len = result.length; i < len; i++) {
        let basekutu = result[i]
        basekutu.sortTime = parseFloat(result[i].titletime.replace(/<i class=\"icon-clock-1\"><\/i> /g, '').replace(/-/g, ''))
        basekutu._id = result[i]._id
        barArr.push(basekutu)
    }
    barArr = barArr.sort((a, b) => {
        return a.sortTime - b.sortTime
    })
    for (let i = 0, len = barArr.length; i < len; i++) {
        // 需要await
        console.log(barArr[i].sortTime)
        await updatemsg(barArr[i], dbo)
    }
}
let updatemsg = function(res, dbo) {
    return new Promise((resolve, reject) => {
        dbo.collection('nianzhai_list').save(res, function() {
            resolve(1)
        })
    })
}