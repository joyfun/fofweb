const sqlite3 = require('better-sqlite3')
const db = new sqlite3('fofdb', { verbose: console.log })
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
db.exec("create table fund_val(code varchar(10),date varchar(10),sumval real)");
db.exec("create table fund_info(code varchar(10),name varchar(40),short_name varchar(40),create_time number ,type varchar(10),scode varchar(10),remark TEXT,class_type  varchar(10) )");
} catch (err) {
  console.log(err);
}
// });
export default db

