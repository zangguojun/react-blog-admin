export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: '登录页',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎页',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/list',
    name: '列表页',
    icon: 'table',
    component: './TableList',
  },
  {
    path: '/article',
    name: '文章',
    icon: 'table',
    component: './ArticleList',
  },
  {
    path: '/tag',
    name: '标签',
    icon: 'table',
    component: './TagList',
  },
  {
    path: '/category',
    name: '分类',
    icon: 'table',
    component: './CategoryList',
  },
  {
    path: '/changelog',
    name: '建站日志',
    icon: 'table',
    component: './ChangelogList',
  },
  {
    path: '/link',
    name: '友链',
    icon: 'table',
    component: './LinkList',
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: '二级页',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
