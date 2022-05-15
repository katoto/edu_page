/*
* db db名称
* selName 为表名
* 用于清理部分mongodb 不用的数据
*/

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://81.69.15.167:27017/'
let selName = 'dapenti'
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
    var dbo = db.db('admin')
    selectData(dbo, function (result) {
        deleteData(result, dbo)
    });
})

let deleteData = async (result, dbo) => {
    for (let i = 0, len = result.length; i < len; i++) {
        dbo.collection(selName).deleteOne({
            '_id': result[i]._id
        })
    }
}
