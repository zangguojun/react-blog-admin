import { request } from 'umi';

/** 获取分类列表 GET /api/category */
export async function category(params, options) {
  const { isFlat, ...otherOptions } = options
  return request('/api/category', {
    method: 'GET',
    params,
    ...(otherOptions || {}),
  }).then(res => {
    if (isFlat) return res?.data?.map(item => ({ label: item?.name, value: item?.is }))
    else return res
  })
}

/** 更新分类 PUT /api/category */
export async function updateCategory(data, options) {
  return request('/api/category', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建分类 POST /api/category */
export async function addCategory(data, options) {
  return request('/api/category', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除分类 DELETE /api/category */
export async function removeCategory(data, options) {
  return request('/api/category', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
