import Cookies from "js-cookie"
const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  token: state => state.token,
  allCart:state =>{
    console.log("call get allCart")
    console.log(state)
    if(state.allCart&&state.allCart.default){
    return state.allCart
  }else{
    console.log("useCookies")
    var acart=JSON.parse(localStorage.getItem('acart'))
    console.log(acart)
    state.allCart=acart
    for (var a in state.allCart){
      if(typeof(state.allCart[a])=='string')
      state.allCart[a]=JSON.parse(state.allCart[a])
    }
    console.log(state.allCart)
    return state.allCart
  }

  },
  info: state => state.role.info,
  logoShow: state => state.layout.logoShow,
  isCollapse: state => state.layout.isCollapse,
  uniquerouter: state => state.layout.uniquerouter,
  tabnavBox: state => state.layout.tabnavBox,
  visible: state => state.layout.visible,
  left: state => state.layout.left,
  top: state => state.layout.top,
  rightNav: state => state.layout.rightNav,
  sysparam: state => state.param,
  allparam: state => state.allparam,
  class_order: state =>["现金","指增","超额","混合","CTA","中性","套利","期权","FOF"],
  param: state =>[{"child":[{"code":"低","id":39,"idx":1,"parent":25,"value":"低"},{"code":"中","id":40,"idx":2,"parent":25,"value":"中"},{"code":"高","id":41,"idx":3,"parent":25,"value":"高"}],"code":"risk_level","id":25,"idx":null,"parent":0,"value":"风险等级"},{"child":[],"code":"risk_target","id":26,"idx":null,"parent":0,"value":"风险目标"},{"child":[{"code":"GeShang","id":33,"idx":null,"parent":32,"value":"GeShang"},{"code":"SiMuWang","id":34,"idx":null,"parent":32,"value":"SiMuWang"},{"code":"1","id":35,"idx":null,"parent":32,"value":"渠道"}],"code":"data_type","id":32,"idx":null,"parent":0,"value":"来源"},{"child":[{"code":"试投","id":63,"idx":null,"parent":62,"value":"试投"},{"code":"专户","id":64,"idx":null,"parent":62,"value":"专户"},{"code":"规模投资","id":65,"idx":null,"parent":62,"value":"规模投资"}],"code":"scale","id":62,"idx":null,"parent":0,"value":"投资规模"},{"child":[],"code":"fofmail","id":68,"idx":null,"parent":0,"value":"zhaoshun@waddc.com"},{"child":[],"code":"retmail","id":69,"idx":null,"parent":0,"value":"zhaoshun@waddc.com"},{"child":[{"code":"FOF","id":55,"idx":null,"parent":11,"value":"FOF"},{"code":"CTA","id":12,"idx":1,"parent":11,"value":"CTA"},{"code":"指增","id":13,"idx":1,"parent":11,"value":"指增"},{"code":"中性","id":14,"idx":1,"parent":11,"value":"中性"},{"code":"套利","id":15,"idx":1,"parent":11,"value":"套利"},{"code":"混合","id":16,"idx":1,"parent":11,"value":"混合"},{"code":"期权","id":24,"idx":1,"parent":11,"value":"期权"}],"code":"class_type","id":11,"idx":1,"parent":0,"value":"产品类别"},{"child":[{"code":"入库","id":67,"idx":0,"parent":19,"value":"入库"},{"code":"预选","id":20,"idx":1,"parent":19,"value":"预选"},{"code":"尽调","id":21,"idx":3,"parent":19,"value":"尽调"},{"code":"候选","id":66,"idx":5,"parent":19,"value":"候选"},{"code":"备投","id":22,"idx":7,"parent":19,"value":"备投"},{"code":"已投","id":23,"idx":9,"parent":19,"value":"已投"},{"code":"对标","id":31,"idx":11,"parent":19,"value":"对标"},{"code":"已赎","id":38,"idx":13,"parent":19,"value":"已赎"}],"code":"stage","id":19,"idx":1,"parent":0,"value":"阶段"}],
  usermenu: state=>state.usermenu,
  allmenu: state=>state.allmenu,

}
export default getters
