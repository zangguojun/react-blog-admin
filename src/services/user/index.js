import { request } from 'umi';

/** 登录接口 POST /api/login/account */
export async function login(data, options) {
  return request('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function queryCurrentUser(options) {
  return request('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(data, options) {
  return request('/api/login/outLogin', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}