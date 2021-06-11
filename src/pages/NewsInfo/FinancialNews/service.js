import request from '@/utils/request';
//默认一二级分类
export async function queryClassList(params) {
  return request(`${PATH}/classes/defaultClasses?language=${params.language}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//查询分类
export async function queryByParentId(params) {
  return request(`${PATH}/classes/queryByParentId?parentId=${params.parentId}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//查询新闻列表
export async function queryNewsList(params) {
  return request(`${PATH}/news/titleList?classId=${params.classId}&size=${params.size}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//新闻详情接口
export async function queryNewsInfo(params) {
  return request(`${PATH}/news/details?newsId=${params.newsId}`,{
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
