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

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(params, options) {
  return request('/api/login/captcha', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** Create user This can only be done by the logged in user. POST /user */
export async function createUser(body, options) {
  return request('/user', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** Creates list of users with given input array POST /user/createWithArray */
export async function createUsersWithArrayInput(body, options) {
  return request('/user/createWithArray', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** Creates list of users with given input array POST /user/createWithList */
export async function createUsersWithListInput(body, options) {
  return request('/user/createWithList', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** Logs user into the system GET /user/login */
export async function loginUser(params, options) {
  return request('/user/login', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** Logs out current logged in user session GET /user/logout */
export async function logoutUser(options) {
  return request('/user/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Get user by user name GET /user/${param0} */
export async function getUserByName(params, options) {
  const { username: param0 } = params;
  return request(`/user/${param0}`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** Updated user This can only be done by the logged in user. PUT /user/${param0} */
export async function updateUser(params, body, options) {
  const { username: param0 } = params;
  return request(`/user/${param0}`, {
    method: 'PUT',
    params,
    data: body,
    ...(options || {}),
  });
}
/** Delete user This can only be done by the logged in user. DELETE /user/${param0} */
export async function deleteUser(params, options) {
  const { username: param0 } = params;
  return request(`/user/${param0}`, {
    method: 'DELETE',
    params,
    ...(options || {}),
  });
}
