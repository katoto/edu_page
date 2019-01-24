// 年摘详情
// 用于清理部分mongodb 不用的数据
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://47.96.234.59:27017/'
// let selName = 'edu_class1_shuxue'
// let selName = 'edu_class1_yuwen'
// let selName = 'edu_class1_yingyu'
// let selName = 'edu_class2_shuxue'
// let selName = 'edu_class2_yuwen'
// let selName = 'edu_class2_yingyu'
// let selName = 'edu_class3_shuxue'
// let selName = 'edu_class3_yuwen'
let selName = 'edu_class3_yingyu'
// 2、查询数据
let selectData = function (db, callback) {
    //连接到表  
    var collection = db.collection(selName)
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
        getList(result, dbo)
    });
})
let getList = async (result, dbo) => {
    console.log(result.length)
    for (let i = 0, len = result.length; i < len; i++) {
        delete result[i].artmsg
        await updatemsg(result[i], dbo)
    }
}
let updatemsg = function (res, dbo) {
    dbo.collection(selName).save(res)
    // 查询并设置
    // return new Promise((resolve, reject) => {
    //     dbo.collection('edu_class1_shuxue').update({ "_id": res._id }, { $set: { artmsg: '' } }, function () {
    //         resolve(1)
    //     })
    // })
}