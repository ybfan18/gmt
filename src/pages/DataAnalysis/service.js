import request from '@/utils/request';
//默认ric信息f10-2
export async function querySecuritiesInfo(params) {
  return request(`${PATH}/f10/securitiesInformation?ric=${params.ric}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//默认ric信息f10-4
export async function queryShareholderInfo(params) {
  return request(`${PATH}/f10/shareholderInformation?ric=${params.ric}&page=${params.page}&pageSize=${params.pageSize}&type=${params.type}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//查询RIC数据
export async function queryRicLists(params) {
  return request(`${PATH}/ric/queryByRic?ric=${params.ric}&pageSize=${params.pageSize}&page=${params.page}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//f10-7资产负债表 损益表 现金流量表接口
export async function queryReportInfo(params) {
  return request(`${PATH}/f107/reportInfo?ric=${params.ric}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//f10-7财务分析接口
export async function queryFinancialAnalysis(params) {
  return request(`${PATH}/f107/financialAnalysis?ric=${params.ric}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//f10-5推荐和目标价数据接口
export async function queryTargetAndRecommandation(params) {
  return request(`${PATH}/f105/targetAndRecommandation?ric=${params.ric}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//f10-5资产负债表、损益表、现金流量预测数据接口
export async function queryForecast(params) {
  return request(`${PATH}/f105/forecast?ric=${params.ric}&forecastNumber=${forecastNumber}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//f10-3接口
export async function queryNoticeByRic(params) {
  let formData = new FormData();
  formData.append('ric', params.ric);
  formData.append('stockTypes', params.stockTypes);
  formData.append('pageSize', params.pageSize);
  formData.append('currentPage', params.currentPage);
  formData.append('language', params.language);
  return request(`${PATH}/f103/noticeByRic`, {
    method: 'post',
    headers: { 'accessToken': params.accessToken, "Content-Type": "application/json" },
    data: JSON.stringify(params)
  });
}
//f10-3公告预览接口
export async function downloadkNotice(params) {
  return request(`${PATH}/news/downloadkNotice?dcn=${params.dcn}&size=${params.size}&fileName=${params.originalFileName}&fileType=${params.fileType}`, {
    method: 'get',
    dataType: 'blob',
    responseType: 'blob',
    headers: { 'accessToken': params.accessToken, },
  });
}