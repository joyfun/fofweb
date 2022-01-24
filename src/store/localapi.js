
import tools from './tools'
import * as df from "danfojs/dist/index";

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
db.exec("CREATE TABLE fund_order (pcode varchar(10),date varchar(10),tcode varchar(10),tname varchar(40),amount real,direction varchar(10) ,status varchar(10))");
db.exec("create table sys_config(code varchar(10),value varchar(80),primary key (code))");
db.exec("insert into sys_config (code,value) values('apihost','http://www.waddc.com')")
db.exec("insert into sys_config (code,value) values('v_cnt','0')")
db.exec("create table fund_val(code varchar(10),date varchar(10),sumval real,primary key (code,date))");
db.exec("create table fund_info(code varchar(10) PRIMARY KEY     NOT NULL,name varchar(40),short_name varchar(40),create_time number ,latest_date varchar(10),type varchar(10),scode varchar(10) ,company varchar(80) ,city varchar(400) ,remark TEXT,class_type  varchar(10) )");
db.exec("insert into fund_info (code,name,class_type,short_name) values('V_Temp','虚拟组合','虚拟','虚拟组合')")

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
    db = new sqlite3(dbPath, { verbose: console.log })
  })
  db = new sqlite3(dbPath, { verbose: console.log })
}
db.calc_virt=()=>{
  const virts=db.prepare("select * from fund_info where class_type='虚拟'").all()
  const indexdate=db.getFundVal("000905.SHW")
  const nowdate=db.getToday()
  for (let avrit of virts){
    if(avrit.remark){
    let ldate=""
    let amts=JSON.parse(avrit.remark)
    for(var day of Object.keys(amts).sort()){
      if(ldate<day){
        ldate=day
      }
    }
    db.getVirt(amts[ldate],ldate,nowdate,indexdate,avrit.code)
    
  }}
},
db.getFundVal=(code,erg="")=>{
  var qsql='SELECT * FROM fund_val where code=?' 
  if(erg){
    qsql=qsql+ " and date<='"+erg+"' "
  }
  qsql=qsql+' order by date'
  const stmt = db.prepare(qsql);
  return stmt.all(code)
}
db.getSocres=(codes,rg)=>{
  db.zz500idx =db.getFundVal('000905.SHW')
    let ret=[]
    codes.split(",").forEach((acode,idx)=>{
      if(acode){
        const istmt =db.prepare('SELECT * FROM fund_info where code=? ')
        var info=istmt.get(acode)
        let rst=db.calc_values(db.getFundVal(acode),rg,info['class_type']=="指增")
        if(rst){
        rst['fundname']=info['code']
        rst['name']=info['short_name']
        rst['class_type']=info['class_type']
        ret.push(rst)
        }
      }
    })
    return ret
  }
  db.get_pctchange=(data)=>{
    var prev=0
    var ret=[NaN]
    data.forEach((val,idx)=>{
      if(prev!=0){
          ret.push(val/prev-1)
      }
      prev=val
    })
    return ret 
  }
  db.cutByDate=(data,rg)=>{
    var ndata=[]
    data.forEach((dt,idx)=>{
      if(dt['date']>=rg[0] &&dt['date']<=rg[1])
      ndata.push(dt)
    })
    if(ndata.length<2){
      return null
    }
    return ndata
  }
  db.calc_values=(data,rg,isExtra=false)=>{
    const ndata=db.cutByDate(data,rg)
    if(!ndata){
      return null
    }
    let datadf=new df.DataFrame(ndata)
    if(isExtra){
    let idxdata=db.cutByDate(db.zz500idx,rg)
    let idxdf=new df.DataFrame(idxdata)
    datadf=df.merge({ left: datadf, right: idxdf, 
                          on: ["date"], how: "left"})
    const fval = datadf.head(1)['sumval'].values[0]
    const fidx = datadf.head(1)['sumval_1'].values[0] 
    const schg=  db.get_pctchange(datadf['sumval'].values) 
    const ichg=  db.get_pctchange(datadf['sumval_1'].values)  
    let retsr=[]
    for (var i in schg){
      retsr.push(schg[i]-ichg[i])
    }
    datadf.addColumn({ "column": "return", "values":retsr, inplace: true })
    datadf.addColumn({ "column": "return_1", "values":datadf['sumval'].div(fval).sub(datadf['sumval_1'].div(fidx)) , inplace: true })
    }else{
    let ret=db.get_pctchange(datadf['sumval'].values)
    datadf.addColumn({ "column": "return", "values":ret, inplace: true })

    }
    let stdval=datadf['return'].std()
    let mean=datadf['return'].mean()

    let win =datadf.iloc({rows:datadf['return'].gt(0)})
    let loss =datadf.iloc({rows:datadf['return'].lt(0)})
    var nhigh=0,hidx=0,drop=1,didx=0,sdidx=0
    var key ='sumval'
    if(isExtra){
      key='return_1'
    }
    datadf['sumval'].values.forEach((mval,idx)=>{
          if(mval>nhigh){
            nhigh=mval
            hidx=idx
          }else{
            let ndrop=mval/nhigh
            if(ndrop<drop){
              drop=ndrop
              sdidx=hidx
            }
            if(sdidx==hidx)
            didx=idx
          }
    })
    
    let [sharpe, calmar, sortino, max_dd, dd_week, win_ratio, y_r, volatility] = [4, 10, 10, 0, 0, 1, 1, 0]
    let shp=datadf.shape
    const sqrt52=Math.sqrt(52)
    if(shp[0]>0){
      sharpe=mean/stdval*sqrt52
      if(isExtra){
        y_r=(datadf.tail(1)['sumval'].values[0]/datadf.head(1)['sumval'].values[0]-datadf.tail(1)['sumval_1'].values[0]/datadf.head(1)['sumval_1'].values[0])*52/shp[0]
        volatility=new df.Series(db.get_pctchange(datadf['return'].values)).std()*sqrt52
      }else{
      y_r=(datadf.tail(1)['sumval'].values[0]/datadf.head(1)['sumval'].values[0]-1)*52/shp[0]
      volatility=datadf['return'].std()*sqrt52
      }
      if(loss.shape[0]>0){
      sortino=mean/Math.sqrt((loss['return'].mul(loss['return']).sum())/(shp[0]-1))*sqrt52
      }
      max_dd=drop-1
      win_ratio=win.shape[0]/shp[0]
      dd_week=didx-sdidx
      calmar =-(y_r / max_dd)
    }
  
  let rst= {"sharpe":sharpe, "calmar":calmar, "sortino":sortino, "dd":max_dd, "dd_week":dd_week, "win_ratio":win_ratio, "yeaily_return":y_r, "volatility":volatility,"std":stdval,'mean':mean,"length":shp[0]}
  console.log(rst)
  return rst
  }
  

  db.sell_fund=(day,codes)=>{
    let cash=0
    console.log(codes)
    for (var code in codes){
      if(code=="cash"){
        cash=cash+codes[code]
        continue
      }
      const ret=db.getFundVal(code,day)
      const lret=ret.length
      cash=cash+ret[lret-1]['sumval']*codes[code]
        } 
    return cash
  }
  db.buy_fund=(cash,day,codes)=>{
    const cnt=codes.length
    let ret={}
    for (var code of codes){
      const svals=db.getFundVal(code,day)
      const slen=svals.length
      let amt=cash / cnt / svals[slen-1]['sumval']
      ret[code]=amt
    }
    console.log(ret)
    return ret
  }
  db.save_fund_info=(name,wts)=>{
    db.exec("update sys_config  set value=cast(value as signed)+1 where code='v_cnt'")
    let cnt=db.prepare("select value from sys_config where code='v_cnt'").get()
    let vname="V_F"+cnt['value']
    db.prepare("insert into fund_info (code,name,short_name,remark,class_type) values (?,?,?,?,'虚拟')").run([vname,name,name,JSON.stringify(wts)])
    db.prepare("update fund_val set code=? where code='V_Temp'").run([vname])
    return vname
  }
  db.deal_Orders=(amt,code,ldate,indexdate)=>{
    let basecash=0
    if(amt["cash"]){
      basecash=amt["cash"]
    }
    let sells=[]
    let sdate=""
    let orders=db.prepare("select * from  fund_order where pcode=? and status='0' order by date,direction desc").all(code)
    if(orders.length<1){
      return
    }
    for(var ord of orders){
      if(ord["direction"]=="卖"){
        sells.push(ord["tcode"])
      }
      sdate=ord["date"]
    }
    let samts={}
    for (var scode of sells){
      //if(amt[scode])
      samts[scode]=amt[scode]
      delete amt[scode]
    }
    console.log(samts)
    for(var row of indexdate){
      let idate=row['date']
      if(idate>=sdate){
        basecash=basecash+db.sell_fund(idate,samts)
        for(var ord of orders){
          if(ord["direction"]=="买"){
              let  ret = db.prepare("SELECT date,sumval FROM fund_val where code =? order by date desc limit 1").get(ord["tcode"])
              let  bamt= ord["amount"]*10000/ret["sumval"]
              basecash=basecash-ord["amount"]*10000
              if(amt[ord["tcode"]]){
                amt[ord["tcode"]]=amt[ord["tcode"]]+bamt
              }else{
                amt[ord["tcode"]]=bamt
              }
          }
        }
        amt['cash']=basecash
        let info =db.prepare('SELECT * FROM fund_info where code=? ').get(code)
        let plan=JSON.parse(info["remark"])
        plan[idate]=amt
        db.prepare("update fund_info set remark=? where code=?").run([JSON.stringify(plan),code])
        db.prepare("update fund_order set status='1' where pcode=?").run([code])

        break;
      }

    }
    

  }
  db.getToday = function(){
    const myDate=new Date();
   var year=myDate.getFullYear()
   var Day=myDate.getDate()>9?myDate.getDate().toString():'0'+myDate.getDate();
   var Month=myDate.getMonth()+1>9?(myDate.getMonth()+1).toString():'0'+(myDate.getMonth()+1);
   return ''+year+Month+Day;
   }
  db.getVirt=(amt,ldate,nowdate,indexdate,code="V_Temp")=>{
    db.deal_Orders(amt,code,ldate,indexdate)
    let rval=[]
    for(var idt of indexdate){
      const idate=idt['date']
      if(idate>=ldate && idate<nowdate){
        console.log(idate)
        let fval=db.sell_fund(idate,amt)
        if(fval>100000){
          fval=fval/10000000
        }
        rval.push({"code":code,"date":idate,"sumval":fval})
      }
    }
    const insert = db.prepare('replace into fund_val(date,code ,sumval ) VALUES (@date ,@code ,@sumval)');
    const insertMany = db.transaction((data) => {
      data.forEach((ele,index)=>{
          insert.run(ele)
        })
      })
    //console.log(rval)
    insertMany(rval)
    
  }
  db.calc_simval=(splits)=>{
    let nextday='20100101'
    let dts = []
    for(var date in splits){
      dts.push(date)
    }
    dts.sort()
    const bcnt=dts.length
    var amt=null
    let cash=1
    const indexdate=db.getFundVal("000905.SHW").filter((value, index, array)=>{
      return value['date']>=dts[0]
    })
    let rval=[]
    let rret={}
    db.prepare("delete from fund_val where code='V_Temp'").run()
    dts.forEach((date,idx)=>{
      if(idx+1<bcnt){
        nextday=dts[idx+1]
      }else{
        nextday=db.getToday()
      }
      if(amt){
        cash=db.sell_fund(date,amt)
      }
      var spts=splits[date].split(",")
      let tbuys=[]
      for(var abuy of spts){
        if(abuy&&abuy.length>3)
        tbuys.push(abuy)
      }
      amt=db.buy_fund(cash,date,tbuys)
      rret[date]=amt
      db.getVirt(amt,date,nextday,indexdate)
      // for(var idt of indexdate){
      //   const idate=idt['date']
      //   if(idate>=date && idate<=nextday){
      //     rval.push({"code":"V_Temp","date":idate,"sumval":db.sell_fund(idate,amt)})
      //   }
      // }
    })

    return rret
  }

//   def sell_fund(self,day,codes):
//   cash=0
//   for code in codes.keys():
//       adf=get_tradedays(code,True).set_index("date")
//       lv=adf.iloc[lambda x: (x.index <=day)].iloc[0]['sumval']
//       newcash=lv*codes[code]
//       # print(f'day:{day} sell fund{code}')
//       cash=cash+newcash
//   return cash


// def buy_fund(self,cash,day,codes):
//   cnt=len(codes)
//   ret={}
//   for code in codes:
//       adf=get_tradedays(code,True).set_index("date")
//       print(f'day:{day} buy fund{code}')
//       lv=adf.iloc[lambda x: (x.index <=day)].iloc[0]['sumval']
//       # print(lv.iloc[0]['sumval'])
//       # print(lv['sumval'].values[0])
//       amt=cash / cnt / (float(lv))
//       print(f'day:{day}:{cash}buy fund{code} with amt:{amt}')
//       ret[code]=amt
  // return ret


}
// });
db.do_calc=(tableData,cols,limit_dic,wts)=>{
  var maxlen=0
  
  var rawdata = JSON.parse(JSON.stringify(tableData));
  for(var ret_df of rawdata){
    maxlen=maxlen<ret_df['length']?ret_df['length']:maxlen
  //去极值
  for(var item in limit_dic){
      ret_df[item] = (ret_df[item] >= limit_dic[item]) * limit_dic[item] + (ret_df[item] < limit_dic[item]) * ret_df[item]
    }
  }
//求最大值
var maxmin={}
for (var item of cols){
  maxmin[item+"_max"]=-99
  maxmin[item+"_min"]=99
        for(var row of rawdata){
          if(row[item]>maxmin[item+"_max"]){
               maxmin[item+"_max"]=row[item]
          }
          if(row[item]<maxmin[item+"_min"]){
               maxmin[item+"_min"]=row[item]
          }
        }
}
for (var item of cols){
 maxmin[item+"_diff"]=maxmin[item+"_max"]-maxmin[item+"_min"]
}


for(var ridx in rawdata){ 
  var row=rawdata[ridx]

  var ascore=0
   for (var idx in cols){
     var item=cols[idx]
     var diff=maxmin[item+"_diff"]
     if(diff==0){
       diff=1
     }
    row[item]=(row[item]-maxmin[item+"_min"])/diff
    ascore+=row[item]*wts[idx]
   }
   if(row['length']<maxlen-3&&row['length']<maxlen*0.8&&maxlen<160){
     ascore=ascore-100
   }
   tableData[ridx]['score']=ascore
}
}
export default db
