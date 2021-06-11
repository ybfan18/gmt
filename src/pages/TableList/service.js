import request from '@/utils/request';
export async function queryRule(params) {
  params = {
    "RetrieveHeadlineML_Request_1": {
      "HeadlineMLRequest": {
        "TimeOut": 0,
        "MaxCount": 0
      }
    }
  }
  return request('/api/News/News.svc/REST/News_1/RetrieveHeadlineML_1', {
    headers: { 'Content-Type': 'application/json' ,
    'X-Trkd-Auth-Token':	'76E2989DB120BE4467CCE08EB82BA0FFEE2B96F9C2E149C975046DB4C449BB559C4E0B7E9892E646E6A891B87DC95A07A13FCF1B54791EC8C39AD75FFD549221CE422A2EF2C590626344826BA323F7692991A99100155F1778AD775CFE145C89',
    'X-Trkd-Auth-ApplicationID':'526169681QqCom'	},
    method: 'POST',
    data: { ...params },
  });
}
export async function removeRule(params) {
  return request('/api/News/News.svc/REST/News_1/RetrieveHeadlineML_1', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/News/News.svc/REST/News_1/RetrieveHeadlineML_1', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/News/News.svc/REST/News_1/RetrieveHeadlineML_1', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
