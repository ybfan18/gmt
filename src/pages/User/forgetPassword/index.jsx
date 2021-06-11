import { Alert, Space, message, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage, Link } from 'umi';
import { getFakeCaptcha, getEmailCode } from '@/services/forgetPassword';
import styles from './index.less';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import cn from 'react-phone-input-2/lang/cn.json';
import { passwordReg, eamilReg, codeMsgCN, codeMsgEN } from '../../../utils/utils';


//电话号码赋值
let phoneNum = '';
let tabCheckTab = 'mobile';
const ForgetPasswordMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const ForgetPassword = (props) => {
  const { userForgetPassword = {}, submitting } = props;
  const { status, type: forgetPasswordType } = userForgetPassword;
  const [phoneValue, setPhoneValue] = useState({});
  const [phone, setPhone] = useState({});
  const [typeTab, setTypeTab] = useState('mobile');
  const intl = useIntl();
  const [form] = ProForm.useForm();

  const handleSubmit = (values) => {
    const { dispatch } = props;
    let formValue = form.getFieldsValue();
    if (tabCheckTab === 'mobile') {
      let params = {
        phone: phoneNum ? phoneNum : '',
        newPassword: formValue.password,
        verificationCode: formValue.captchaPhone
      }
      dispatch({
        type: 'forgetPassword/forgetPasswordByPhone',
        payload: params,
      });
    } else {
      let paramsMail = {
        email: formValue.mail,
        newPassword: formValue.password,
        verificationCode: formValue.captchaEmail
      }
      dispatch({
        type: 'forgetPassword/forgetPasswordByMail',
        payload: paramsMail,
      });
    }

  };

  const [phoneLang, setPhoneLang] = useState()//电话号码

  //判断语言，地区语言切换
  const setPhoneL = () => {
    if (intl.locale === "zh-CN") {
      setPhoneLang(cn);
    }
  }

  useEffect(() => {
    setPhoneL();
  }, [])

  //设置电话号码
  const getPhoneValue = (e) => {
    phoneNum = e;
    setPhoneValue(e);
  }
  //获取验证码
  const getVerificationCode = (typeStr) => {
    tabCheckTab = typeStr;
    let result = {};
    if (typeStr === 'mail') {
      let mailValue = form.getFieldValue('mail');
      if (mailValue) {
        result = getEmailCode(mailValue).then(
          res => {
            if (res.state) {
              if (intl.locale === "zh-CN") {
                message.success(codeMsgCN);
              } else {
                message.success(codeMsgEN);
              }
            } else {
              message.error(res.message);
            }
          }

        );
      }
    } else {
      if (phoneNum) {
        result = getFakeCaptcha(phoneNum).then(
          res => {
            if (res.state) {
              if (intl.locale === "zh-CN") {
                message.success(codeMsgCN);
              } else {
                message.success(codeMsgEN);
              }
            } else {
              message.error(res.message);
            }
          }
        );
      }
    }
  }

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        autoComplete="off"
        form={form}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '464px',
              height: '48px',
              display: 'block',
              margin: '0 auto',
              background: '#EDC027',
              borderRadius: '2px',
              borderColor: '#EDC027'
            },
          },
        }}
        onFinish={(values) => {
          handleSubmit(values);
          return Promise.resolve();
        }}
      >
        <div className={styles.contentTitle}>
          <span>
            {intl.formatMessage({
              id: 'pages.layouts.forgetPassword.title',
              defaultMessage: '忘记密码',
            })}
          </span>
        </div>
        <Tabs activeKey={typeTab} onChange={setTypeTab} className={styles.widthContent}>
          <Tabs.TabPane
            key="mobile"
            tab={intl.formatMessage({
              id: 'pages.forgetPassword.phone.tab',
              defaultMessage: '手机找回',
            })}

          />
          <Tabs.TabPane
            style={{ 'marginLeft': '128px' }}
            key="mail"
            tab={intl.formatMessage({
              id: 'pages.forgetPassword.mail.tab',
              defaultMessage: '邮箱找回',
            })}
          />
        </Tabs>
        <div className={styles.tabLine}></div>
        <div className={styles.widthContent}>
          {status === 'error' && forgetPasswordType === 'mail' && !submitting && (
            <ForgetPasswordMessage
              content={intl.formatMessage({
                id: 'pages.forgetPassword.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误（admin/ant.design)',
              })}
            />
          )}
          {typeTab === 'mail' && (
            <>
              <ProFormText
                name="mail"
                fieldProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.forgetPassword.mail.placeholder',
                  defaultMessage: '请输入邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.forgetPassword.mail.required"
                        defaultMessage="请输入邮箱!"
                      />
                    ),
                  },
                  {
                    pattern: eamilReg,
                    message: (
                      <FormattedMessage
                        id="pages.register.email.reg"
                        defaultMessage="邮箱格式不正确！"
                      />
                    )
                  }
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.forgetPassword.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }

                  return intl.formatMessage({
                    id: 'pages.forgetPassword.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captchaEmail"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.forgetPassword.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={() => getVerificationCode('mail')}
              />
            </>
          )}

          {status === 'error' && forgetPasswordType === 'mobile' && !submitting && (
            <ForgetPasswordMessage content="验证码错误" />
          )}
          {typeTab === 'mobile' && (
            <>
              <PhoneInput
                country={'cn'}
                autoFormat={true}
                enableSearch={true}
                onChange={(e) => getPhoneValue(e)}
                localization={phoneLang}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.forgetPassword.phoneNumber.placeholder',
                  defaultMessage: '请输入手机号',
                })}
                inputProps={{
                  name: 'mobile',
                  required: true
                }}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.forgetPassword.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.forgetPassword.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }

                  return intl.formatMessage({
                    id: 'pages.forgetPassword.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captchaPhone"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.forgetPassword.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={() => getVerificationCode('mobile')}
              />
            </>
          )}

          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
            }}
            placeholder={intl.formatMessage({
              id: 'pages.forgetPassword.password.placeholder',
              defaultMessage: '密码: ant.design',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.forgetPassword.password.required"
                    defaultMessage="请输入密码！"
                  />
                ),
              }, {
                pattern: passwordReg,
                message: (
                  <FormattedMessage
                    id="pages.register.password.reg"
                    defaultMessage="密码8-20位,数字,字母或字符至少两种！"
                  />
                )
              }
            ]}
          />
          <ProFormText.Password
            name="passwordAgain"
            fieldProps={{
              size: 'large',
            }}
            placeholder={intl.formatMessage({
              id: 'pages.forgetPassword.password.again.placeholder',
              defaultMessage: '请再次输入密码',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.forgetPassword.password.again.required"
                    defaultMessage="请再次输入密码！"
                  />
                ),
              }, {
                pattern: passwordReg,
                message: (
                  <FormattedMessage
                    id="pages.register.password.reg"
                    defaultMessage="密码8-20位,数字,字母或字符至少两种！"
                  />
                )
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(intl.formatMessage({
                    id: 'pages.register.password.notSame',
                    defaultMessage: '两次密码不一致',
                  }));
                },
              }),
            ]}
          />
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <span className={styles.textWhite}>
                <FormattedMessage id="pages.register.readAndAgree" defaultMessage="我已阅读并同意" />
              </span>
            </ProFormCheckbox>
            <span className={styles.textYellow}>
              <FormattedMessage id="pages.login.userTerms" defaultMessage="用户条款和条件" />
              <span style={{ 'color': 'white' }}>
                <FormattedMessage id="pages.login.asWell" defaultMessage="以及" />
              </span>
              <FormattedMessage id="pages.login.privacyPolicy" defaultMessage="隐私政策" />
            </span>
          </div>
        </div>
      </ProForm>
      <div>
        <div className={styles.widthContent}
          style={{
            marginTop: 32,
            marginBottom: 40,
            textAlign: 'center'
          }}
        >
          <span className={styles.textWhite}>
            <FormattedMessage id="pages.forgetPassword.haveAccount" defaultMessage="密码已找回?" />
          </span>
          <Link to={{
            pathname: '/user/login'
          }}>
            <span className={[`${styles.textYellow}`, `${styles.spanPointer}`].join(' ')}>
              <FormattedMessage id="pages.forgetPassword.signInNow" defaultMessage="立即登录" />
            </span>
          </Link>
        </div>
      </div>
    </div >
  );
};

export default connect(({ forgetPassword, loading }) => ({
  userForgetPassword: forgetPassword,
  submitting: loading.effects['forgetPassword/forgetPasswordByMail', 'forgetPassword/forgetPasswordByPhone'],
}))(ForgetPassword);
