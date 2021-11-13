// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

/** 获取文章列表 GET /api/article */
export async function article(params, options) {
  return request('/api/article', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 新建文章 PUT /api/article */

export async function updateArticle(data, options) {
  return request('/api/article', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}
/** 新建文章 POST /api/article */

export async function addArticle(data, options) {
  return request('/api/article', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}
/** 删除文章 DELETE /api/article */

export async function removeArticle(data, options) {
  return request('/api/article', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
