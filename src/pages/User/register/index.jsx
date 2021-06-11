import { Alert, Space, message, Tabs, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage, Link } from 'umi';
import { getFakeCaptcha, getEmailCode } from '@/services/register';
import styles from './index.less';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import cn from 'react-phone-input-2/lang/cn.json';
import { passwordReg, eamilReg, codeMsgCN, codeMsgEN } from '../../../utils/utils';

//电话号码赋值
let phoneNum = '';
const RegisterMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Register = (props) => {
  const { userRegister = {}, submitting } = props;
  const { status, type: registerType } = userRegister;
  const [typeTab, setTypeTab] = useState('mobile');
  const intl = useIntl();
  const [form] = ProForm.useForm();

  const handleSubmit = () => {
    let validateForm = [];
    if (typeTab === 'mail') {
      validateForm = ['mail', 'captcha', 'password', 'passwordAgain'];
    } else {
      validateForm = ['mobile', 'captcha', 'password', 'passwordAgain'];
    }
    form.validateFields(validateForm, (err, values) => {
      if (err) return;
    })
    const { dispatch } = props;
    let formValue = form.getFieldsValue();
    let params = {
      emailAdress: formValue.mail,
      iphoneNumber: phoneNum,
      password: formValue.password,
      verificationCode: formValue.captcha,
      recommendationCode: formValue.recommendationCode,
      identity: "personal"
    }
    dispatch({
      type: 'register/register',
      payload: params,
      callback: (res) => {
        if (res) {
          message.success(res.message);
        }
      }
    });
  }

  const [phoneLang, setPhoneLang] = useState()//地区语言

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
  }
  //获取验证码
  const getVerificationCode = (typeStr) => {
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
        autoComplete='off'
        initialValues={{
          autoLogin: true,

        }}
        form={form}
        submitter={false}
        onFinish={(values) => {
          handleSubmit(values);
          return Promise.resolve();
        }}
      >
        <div className={styles.contentTitle}>
          <span>
            {intl.formatMessage({
              id: 'pages.layouts.register.title',
              defaultMessage: '欢迎注册GMT',
            })}
          </span>
        </div>
        <Tabs activeKey={typeTab} onChange={setTypeTab} className={styles.widthContent}>
          <Tabs.TabPane
            key="mobile"
            tab={intl.formatMessage({
              id: 'pages.register.phoneRegister.tab',
              defaultMessage: '手机注册',
            })}
          />
          <Tabs.TabPane
            key="mail"
            tab={intl.formatMessage({
              id: 'pages.register.mailRegister.tab',
              defaultMessage: '邮箱注册',
            })}
          />
        </Tabs>
        <div className={styles.tabLine}></div>
        <div className={styles.widthContent}>
          {status === 'error' && registerType === 'mail' && !submitting && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.register.accountLogin.errorMessage',
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
                  id: 'pages.register.mail.placeholder',
                  defaultMessage: '请输入邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.register.mail.required"
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
                  id: 'pages.login.captcha.placeholder',
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
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={() => getVerificationCode('mail')}
              />
            </>
          )}

          {status === 'error' && registerType === 'mobile' && !submitting && (
            <RegisterMessage content="验证码错误" />
          )}
          {typeTab === 'mobile' && (
            <>
              <PhoneInput
                name="mobile"
                country={'cn'}
                autoFormat={true}
                enableSearch={true}
                onChange={(e) => getPhoneValue(e)}
                localization={phoneLang}
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
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
                  id: 'pages.login.captcha.placeholder',
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
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
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
              id: 'pages.register.password.placeholder',
              defaultMessage: '请输入密码',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.register.password.required"
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
              id: 'pages.register.password.again.placeholder',
              defaultMessage: '请输入密码',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.register.password.again.required"
                    defaultMessage="请输入密码！"
                  />
                ),
              },
              {
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
          <ProFormText
            name="recommendationCode"
            fieldProps={{
              size: 'large',
            }}
            placeholder={intl.formatMessage({
              id: 'pages.register.recommendationCode.placeholder',
              defaultMessage: '请输推荐码',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.register.recommendationCode.required"
                    defaultMessage="请输推荐码！"
                  />
                ),
              },
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
        <Button className={styles.buttonUser} onClick={handleSubmit} loading={submitting}>
          <FormattedMessage id="pages.register.button" defaultMessage="创建账户" />
        </Button>
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
            <FormattedMessage id="pages.register.haveAccount" defaultMessage="已有账号?" />
          </span>
          <Link to={{
            pathname: '/user/login'
          }}>
            <span className={[`${styles.textYellow}`, `${styles.spanPointer}`].join(' ')}>
              <FormattedMessage id="pages.register.signInNow" defaultMessage="立即登录" />
            </span>
          </Link>
        </div>
      </div>
    </div >
  );
};

export default connect(({ register, loading }) => ({
  userRegister: register,
  submitting: loading.effects['register/register'],
}))(Register);
