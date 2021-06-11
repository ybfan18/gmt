import request from '@/utils/request';
//邮箱找回密码接口
export async function findPassWordByEmail(params) {
    let formData = new FormData();
    formData.append('email', params.email);
    formData.append('newPassword', params.newPassword);
    formData.append('verificationCode', params.verificationCode);
    return request(`${PATH}/userInfo/findPassWordByEmail`, {
        method: 'post',
        data: formData,
    });
}
//手机找回密码接口
export async function findPassWordByPhone(params) {
    let formData = new FormData();
    formData.append('phoneNum', params.phone);
    formData.append('newPassword', params.newPassword);
    formData.append('verificationCode', params.verificationCode);
    return request(`${PATH}/userInfo/findPassWordByPhone`, {
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