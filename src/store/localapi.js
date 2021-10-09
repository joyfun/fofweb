
import tools from './tools'
var db={}
if(tools.isElectron()){
const sqlite3 = require('better-sqlite3')
const path = require('path')
const os = require('os')
const fs = require('fs')
const FUND_HOME = process.env.VARDA_HOME || os.homedir()
const dbPath = path.resolve(FUND_HOME, 'fofdb.sqlite3')
console.log(FUND_HOME)
db = new sqlite3(dbPath, { verbose: console.log })
// db.serialize(() => {
//     db.run("create table test(name varchar(15))",function(){
//       db.run("insert into test values('hello,word')",function(){
//         db.all("select * from test",function(err,res){
//           if(!err){
//             console.log(JSON.stringify(res));
//       }
//       else{
//             console.log(err);
//       }
//     });
//   });
// });
try {
db.exec("create table fund_val(code varchar(10),date varchar(10),sumval real,primary key (code,date))");
db.exec("create table fund_info(code varchar(10),name varchar(40),short_name varchar(40),create_time number ,type varchar(10),scode varchar(10) PRIMARY KEY     NOT NULL,remark TEXT,class_type  varchar(10) )");
} catch (err) {
  console.log(err);
}
db.reload=(data)=>{
  db.close()
  console.log(data.length)
  fs.writeFile(dbPath,data,(error)=>{
    if(error){console.log(error)}
    else{
      console.log("restore file:"+dbPath)
    }
  })
  db = new sqlite3(dbPath, { verbose: console.log })
}
}
// });
export default db

