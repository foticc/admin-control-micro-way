import { http, HttpResponse } from 'msw';

const menuList = http.get('/site/api/sysPermission/menu/*', () => {
  return HttpResponse.json({
    code: 0,
    msg: 'SUCCESS',
    data: [
      {
        id: 1255,
        menuName: '客户端',
        code: 'default:dashboard',
        fatherId: 0,
        orderNum: 7,
        path: '/default/clients',
        menuType: 'C',
        visible: true,
        status: true,
        icon: 'docker',
        alIcon: 'icon-medium',
        newLinkFlag: false,
        createTime: null,
        updateTime: null
      }
    ]
  });
});

// 删除用户，入参示例为，删除id为3的角色
// {
//   ids:[3]
// }
const delMenu = http.post('/site/api/sysPermission/del', () => {
  return HttpResponse.json({ code: 0, msg: 'SUCCESS', data: null });
});

const getMenuInfo = http.get('/site/api/sysPermission/*', () => {
  return HttpResponse.json({
    code: 0,
    msg: 'SUCCESS',
    data: {
      id: 1255,
      menuName: '客户端',
      code: 'default:clients',
      fatherId: 0,
      orderNum: 7,
      path: '/default/clients',
      menuType: 'C',
      visible: true,
      status: true,
      icon: '',
      alIcon: 'icon-medium',
      newLinkFlag: false,
      createTime: null,
      updateTime: null
    }
  });
});

const updateMenu = http.put('/site/api/sysPermission', () => {
  return HttpResponse.json({ code: 0, msg: 'SUCCESS', data: null });
});

// 删除菜单，入参示例为，删除id为3的菜单
// {
//   ids:[3]
// }
const delRole = http.post('/site/api/sysPermission/del/', () => {
  return HttpResponse.json({ code: 0, msg: 'SUCCESS', data: null });
});

// 添加子菜单，入参示例为，添加一个子菜单
// {
//   "menuName": "菜单名称",
//   "code": "default:dashboard:test",
//   "orderNum": 4,
//   "menuType": "C",
//   "path": "/default/dashboard/test",
//   "visible": true,
//   "status": true,
//   "newLinkFlag": false,
//   "icon": "caret-right",
//   "alIcon": null,
//   "fatherId": 1 // 对应父级菜单的id
// }
const addChild = http.post('/site/api/sysPermission', () => {
  return HttpResponse.json({ code: 0, msg: 'SUCCESS', data: null });
});

export const menu = [menuList, delMenu, getMenuInfo, updateMenu, delRole, addChild];
