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
    path: '/article',
    name: '文章',
    icon: 'profile',
    component: './ArticleList',
  },
  {
    path: '/article-detail/:id',
    component: './ArticleDetail',
  },
  {
    path: '/tag',
    name: '标签',
    icon: 'tags',
    component: './TagList',
  },
  {
    path: '/category',
    name: '分类',
    icon: 'paperClip',
    component: './CategoryList',
  },
  {
    path: '/changelog',
    name: '建站日志',
    icon: 'file',
    component: './ChangelogList',
  },
  {
    path: '/link',
    name: '友链',
    icon: 'link',
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
