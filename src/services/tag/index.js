import { request } from 'umi';

/** 获取标签列表 GET /api/tag */
export async function tag(params, options) {
  return request('/api/tag', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 更新标签 PUT /api/tag */
export async function updateTag(data, options) {
  return request('/api/tag', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建标签 POST /api/tag */
export async function addTag(data, options) {
  return request('/api/tag', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除标签 DELETE /api/tag */
export async function removeTag(data, options) {
  return request('/api/tag', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
