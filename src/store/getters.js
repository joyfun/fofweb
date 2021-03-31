const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  token: state => state.token,
  info: state => state.role.info,
  logoShow: state => state.layout.logoShow,
  isCollapse: state => state.layout.isCollapse,
  uniquerouter: state => state.layout.uniquerouter,
  tabnavBox: state => state.layout.tabnavBox,
  visible: state => state.layout.visible,
  left: state => state.layout.left,
  top: state => state.layout.top,
  rightNav: state => state.layout.rightNav,
  options: state=>  [
    {
value: '无',
label: '无'
},{
value: '预选',
label: '预选'
}, {
value: '尽调',
label: '尽调'
}, {
value: '备投',
label: '备投'
},
{
    value: '对标',
    label: '对标'
    }, {
value: '已投',
label: '已投'
}],
  class_types: state=> [{
    value: 'CTA',
    label: 'CTA'
    }, {
    value: '指增',
    label: '指增'
    }
    , {
    value: '中性',
    label: '中性'
    }, {
    value: '套利',
    label: '套利'
    }, {
    value: '混合',
    label: '混合'
    }, {
    value: '期权',
    label: '期权'
    }]

}
export default getters
