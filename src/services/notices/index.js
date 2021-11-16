import { request } from 'umi';

/** 获取消息列表 GET /api/notices */
export async function getNotices(options) {
  return request('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
