const sqlite = require('sqlite3').verbose()
const { promisify } = require('util');
const { join } = require('path');

const dbPath = join(__dirname, 'dbSqlite/configuration.db');

const db = new sqlite.Database(dbPath);

db.all = promisify(db.all);

module.exports = db;
// // any query: insert/delete/update
// exports.run=function(query) {
//     return new Promise(function(resolve, reject) {
//         this.db.run(query, 
//             function(err)  {
//                 if(err) reject(err.message)
//                 else    resolve(true)
//         })
//     })    
// }

// // first row read
// exports.get=function(query, params) {
//     return new Promise(function(resolve, reject) {
//         this.db.get(query, params, function(err, row)  {
//             if(err) reject("Read error: " + err.message)
//             else {
//                 resolve(row)
//             }
//         })
//     }) 
// }

// // set of rows read
// exports.all=function(query, params) {
//     return new Promise(function(resolve, reject) {
//         if(params == undefined) params=[]

//         this.db.all(query, params, function(err, rows)  {
//             if(err) reject("Read error: " + err.message)
//             else {
//                 resolve(rows)
//             }
//         })
//     }) 
// }

// // each row returned one by one 
// exports.each=function(query, params, action) {
//     return new Promise(function(resolve, reject) {
//         var db = this.db
//         db.serialize(function() {
//             db.each(query, params, function(err, row)  {
//                 if(err) reject("Read error: " + err.message)
//                 else {
//                     if(row) {
//                         action(row)
//                     }    
//                 }
//             })
//             db.get("", function(err, row)  {
//                 resolve(true)
//             })            
//         })
//     }) 
// }

// exports.close=function() {
//     return new Promise(function(resolve, reject) {
//         this.db.close()
//         resolve(true)
//     }) 
// }