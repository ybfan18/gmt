import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';
export async function accountLogin(params) {
  let formData = new FormData();
  formData.append('info', params.info);
  formData.append('password', params.password);
  formData.append('type', params.type);
  return request(`${PATH}/userInfo/login`, {
    method: 'post',
    data: formData,
  });
}
//手机号验证码
export async function getFakeCaptcha(mobile) {
  return request(`${PATH}/sms/send?phone=${mobile}`);
}
//邮箱验证码
export async function getEmailCode(email) {
  return request(`${PATH}/email/send?email=${email}`);
}
//登出
export async function loginOut() {
  return request(`${PATH}/userInfo/loginOut`, {
    headers: { 'accessToken': getAuthority() },
  });
}
