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
  cart: state =>{if(state.cart&&state.cart.length>0){
    return state.cart
  }else{
    return JSON.parse(decodeURIComponent(Cookies.get("ccart")))
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
  usermenu: state=>state.usermenu,
  allmenu: state=>state.allmenu,

}
export default getters
