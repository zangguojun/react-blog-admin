import { request } from 'umi';

/** 获取友链列表 GET /api/link */
export async function link(params, options) {
  return request('/api/link', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 更新友链 PUT /api/link */
export async function updateLink(data, options) {
  return request('/api/link', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建友链 POST /api/link */
export async function addLink(data, options) {
  return request('/api/link', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除友链 DELETE /api/link */
export async function removeLink(data, options) {
  return request('/api/link', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
