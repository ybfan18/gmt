import request from '@/utils/request';
export async function accountRegister(params) {
  return request(`${PATH}/userInfo/register`, {
    headers: { 'Content-Type': 'application/json' },
    method:'post',
    data: {...params},
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
