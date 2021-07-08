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
  return request(`${PATH}/f105/forecast?ric=${params.ric}&forecastNumber=${params.forecastNumber}`, {
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
//f10-6获取股价接口
export async function querySharePrice(params) {
  return request(`${PATH}/f106/getInterday?ric=${params.ric}&startTime=${params.startTime}&endTime=${params.endTime}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken, },
  });
}
//f10-8获取事件正文接口
export async function queryEventContent(params) {
  return request(`${PATH}/f108/getEventContent?eventId=${params.eventId}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken, },
  });
}
//f10-8事件分类查询接口
export async function queryByOfType(params) {
  return request(`${PATH}/public/queryByOfType?ofType=${params.ofType}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken, },
  });
}
//f10-8重大事件接口
export async function querySignificantEvent(params) {
  let formData = new FormData();
  formData.append('topics', params.topics);
  formData.append('startTime', params.startTime);
  formData.append('endTime', params.endTime);
  formData.append('ric', params.ric);
  formData.append('maxNumberOfItems', params.maxNumberOfItems);
  return request(`${PATH}/f108/significantEvent`, {
    method: 'post',
    headers: { 'accessToken': params.accessToken,  "Content-Type": "application/json"},
    data: JSON.stringify(params)
  });
}
//f10-8获取ric股利相关接口
export async function queryExDividendsHeadline(params) {
  return request(`${PATH}/f108/exDividendsHeadline?startTime=${params.startTime}&endTime=${params.endTime}&pageNumber=${params.pageNumber}&recordsPerPage=${params.recordsPerPage}&ric=${params.ric}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken, },
  });
}
//f10-9市场表现比较接口
export async function queryRatiosReport(params) {
  return request(`${PATH}/f109/queryRatiosReport?industryType=${params.industryType}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken, },
  });
}
//f10-9获取估值分析接口
export async function queryValueData(params) {
  return request(`${PATH}/f109/queryValueData?industryType=${params.industryType}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken, },
  });
}
//f10-9行业分类接口
export async function getIndustryType(params) {
  return request(`${PATH}/industry/getIndustryType?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken, },
  });
}