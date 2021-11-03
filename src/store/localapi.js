
import tools from './tools'
var db={
  getSocres:(codes)=>{
    var zz500idx =this.getFundVal('000905.SHW')
    let ret=[]
    codes.split(",").forEach((acode,idx)=>{
      if(acode){
        const istmt =this.prepare('SELECT * FROM fund_info where code=? ')
        var info=istmt.get(acode)
        console.log(info)
        let rst=this.calc_values(this.getFundVal(acode),info['class_type']=="指增")
        if(rst){
        rst['fundname']=info['code']
        rst['name']=info['short_name']
        rst['class_type']=info['class_type']
        ret.push(rst)
        }

      }
    })
    this.tableData=ret
    this.calc_score()
  },
  
}


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

