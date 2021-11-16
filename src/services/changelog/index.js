import { request } from 'umi';

/** 获取日志列表 GET /api/changelog */
export async function changelog(params, options) {
  return request('/api/changelog', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 更新日志 PUT /api/changelog */
export async function updateChangelog(data, options) {
  return request('/api/changelog', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建日志 POST /api/changelog */
export async function addChangelog(data, options) {
  return request('/api/changelog', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除日志 DELETE /api/changelog */
export async function removeChangelog(data, options) {
  return request('/api/changelog', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
