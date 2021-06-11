import request from '@/utils/request';
//默认分类
export async function queryClassList(params) {
  return request(`${PATH}/classes/defaultClasses?language=${params.language}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//指标分类查询-财经指标
export async function queryByOfType(params) {
  return request(`${PATH}/public/queryByOfType?ofType=${params.ofType}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//央行基准利率
export async function queryInterestRate(params) {
  return request(`${PATH}/economic/interestRate?language=${params.language}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//经济指标接口
export async function queryIndicators(params) {
  return request(`${PATH}/economic/indicators`, {
    method: 'post',
    data: params,
    headers: { 'accessToken': params.accessToken },
  });
}
//经济事件接口
export async function queryEconomicEvent(params) {
  return request(`${PATH}/economic/event`, {
    method: 'post',
    data: params,
    headers: { 'accessToken': params.accessToken },
  });
}
