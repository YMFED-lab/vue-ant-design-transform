// 路由模拟

// 分析页
export const analysis = [
  {
    "id": "1",
    "pid": 1,
    "parent_id": "",
    "title": "分析页",
    "icon": "desktop",
    "url": "analysis/index",
    "file_path": "analysis/index",
    "params": "",
    "node": "#",
    "sort": 0,
    "status": 1,
    "create_by": 0,
    "create_at": "0000-00-00 00:00:00",
    "is_inner": false,
    "values": "",
    "show_slider": true,
    "statusText": "使用中",
    "innerText": "导航",
    "fullUrl": "analysis/index",
    "children": []
  }
]

// ldap
export const ldap_mock = [
  {
    "id": "2",
    "pid": 2,
    "parent_id": "",
    "title": "LDAP管理",
    "icon": "desktop",
    "url": "#",
    "file_path": "#",
    "params": "",
    "node": "#",
    "sort": 0,
    "status": 1,
    "create_by": 0,
    "create_at": "0000-00-00 00:00:00",
    "is_inner": false,
    "values": "",
    "show_slider": true,
    "statusText": "使用中",
    "innerText": "导航",
    "fullUrl": "#",
    "children": [{
      "id": "21",
      "pid": 21,
      "parent_id": '2',
      "title": "用户管理",
      "icon": "",
      "url": "ldap/user",
      "file_path": "ldap/user",
      "params": "",
      "node": "123",
      "sort": 100,
      "status": 1,
      "create_by": 0,
      "create_at": "0000-00-00 00:00:00",
      "is_inner": false,
      "values": "",
      "show_slider": true,
      "statusText": "使用中",
      "innerText": "导航",
      "fullUrl": "ldap/user"
    },]
  }
]