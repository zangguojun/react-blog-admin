import { request } from 'umi';

/** 获取文章列表 GET /api/article */
export async function article(params, options) {
  return request('/api/article', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/article */
export async function updateArticle(options) {
  return request('/api/article', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/article */
export async function addArticle(options) {
  return request('/api/article', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/article */
export async function removeArticle(options) {
  return request('/api/article', {
    method: 'DELETE',
    ...(options || {}),
  });
}
