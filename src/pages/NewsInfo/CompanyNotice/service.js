import request from '@/utils/request';
//默认分类
export async function queryClassList(params) {
  return request(`${PATH}/classes/defaultClasses?language=${params.language}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//查询公告分类
export async function queryNoticeClass(params) {
  return request(`${PATH}/stock/queryByLanguage?language=${params.language}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//公告预览接口
export async function downloadkNotice(params) {
  return request(`${PATH}/news/downloadkNotice?dcn=${params.dcn}&size=${params.size}&fileName=${params.originalFileName}&fileType=${params.fileType}`, {
    method: 'get',
    dataType: 'blob',
    responseType: 'blob',
    headers: { 'accessToken': params.accessToken, },
  });
}
//查询公告列表
export async function queryNoticeList(params) {
  let formData = new FormData();
  formData.append('twoLevelNewsClassId', params.twoLevelNewsClassId);
  formData.append('stockTypes', params.stockTypes);
  formData.append('pageSize', params.pageSize);
  formData.append('currentPage', params.currentPage);
  formData.append('language', params.language);
  return request(`${PATH}/news/noticeList`, {
    method: 'post',
    headers: { 'accessToken': params.accessToken, "Content-Type": "application/json" },
    data: JSON.stringify(params)
  });
}
//查询RIC数据
export async function queryRicLists(params) {
  return request(`${PATH}/ric/queryByRic?ric=${params.ric}&pageSize=${params.pageSize}&page=${params.page}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//查询公告列表通过ric
export async function queryNoticeListByRic(params) {
  let formData = new FormData();
  formData.append('ric', params.ric);
  formData.append('stockTypes', params.stockTypes);
  formData.append('pageSize', params.pageSize);
  formData.append('currentPage', params.currentPage);
  formData.append('language', params.language);
  return request(`${PATH}/news/noticeListByRic`, {
    method: 'post',
    headers: { 'accessToken': params.accessToken, "Content-Type": "application/json" },
    data: JSON.stringify(params)
  });
}