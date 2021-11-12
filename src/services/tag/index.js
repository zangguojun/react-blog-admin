import { request } from 'umi';

/** 获取标签列表 GET /api/tag */
export async function tag(params, options) {
  return request('/api/tag', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 新建标签 PUT /api/tag */
export async function updateTag(options) {
  return request('/api/tag', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建标签 POST /api/tag */
export async function addTag(options) {
  return request('/api/tag', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除标签 DELETE /api/tag */
export async function removeTag(options) {
  return request('/api/tag', {
    method: 'DELETE',
    ...(options || {}),
  });
}
