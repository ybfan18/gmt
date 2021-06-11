import { Alert, Space, message, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage, Link } from 'umi';
import { getFakeCaptcha, getEmailCode } from '@/services/login';
import styles from './index.less';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import cn from 'react-phone-input-2/lang/cn.json';
import { passwordReg, eamilReg, codeMsgCN, codeMsgEN, getCookie } from '../../../utils/utils';


//电话号码赋值
let phoneNum = '';
const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [typeTab, setTypeTab] = useState('mobile');
  const intl = useIntl();
  const [form] = ProForm.useForm();

  const handleSubmit = (values) => {
    const { dispatch } = props;
    let formValue = form.getFieldsValue();
    let params = {
      info: formValue.userName,
      password: formValue.password,
      type: "3"
    }
    let autoLoginParam = { autoLogin: formValue.autoLogin }
    dispatch({
      type: 'login/login',
      payload: { params, autoLoginParam }
    });
  };

  const [phoneLang, setPhoneLang] = useState()//电话号码

  //判断语言，地区语言切换
  const setPhoneL = () => {
    if (intl.locale === "zh-CN") {
      setPhoneLang(cn);
    }
  }

  useEffect(() => {
    //记住密码自动填充密码
    if (getCookie('username') != '' && getCookie('password') != '') {
      form.setFieldsValue({ userName: getCookie('username'), password: getCookie('password') })
    }
    setPhoneL();
  }, [])

  const [phoneLoginWay, setPhoneLoginWay] = useState(0)//手机登陆方式，默认是0：手机密码登陆，1:验证码登陆

  //手机登陆方式切换
  const setPhoneWay = (type) => {
    setPhoneLoginWay(type);
  }

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
        initialValues={{
          autoLogin: true,
        }}
        form={form}
        // autoComplete='off'
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
              id: 'pages.layouts.userLayout.title',
              defaultMessage: '欢迎登录GMT',
            })}
          </span>
        </div>
        <Tabs activeKey={typeTab} onChange={setTypeTab} className={styles.widthContent}>
          <Tabs.TabPane
            key="mobile"
            tab={intl.formatMessage({
              id: 'pages.login.phoneLogin.tab',
              defaultMessage: '手机登录',
            })}
          />
          <Tabs.TabPane
            key="account"
            tab={intl.formatMessage({
              id: 'pages.login.accountLogin.tab',
              defaultMessage: '账户登录',
            })}
          />
        </Tabs>
        <div className={styles.tabLine}></div>
        <div className={styles.widthContent}>
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误（admin/ant.design)',
              })}
            />
          )}
          {typeTab === 'account' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '请输入用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '请输入密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
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
                  }
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          {typeTab === 'mobile' && (
            <>
              <PhoneInput
                country={'cn'}
                autoFormat={true}
                enableSearch={true}
                onChange={getPhoneValue}
                localization={phoneLang}
                name="mobile"
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
                  },
                ]}
              />
              {phoneLoginWay === 0 ?
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder',
                    defaultMessage: '请输入密码',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.password.required"
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
                /> : phoneLoginWay === 1 ?
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
                  /> : ''}
            </>
          )}
          <div
            style={{
              marginBottom: 24,
              marginTop: 8
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <span className={styles.textYellow}>
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="记住我" />
              </span>
            </ProFormCheckbox>
            {typeTab === 'mobile' && (
              <span
                style={{
                  float: 'right',
                }}
              >
                <span className={[`${styles.textYellow}`, `${styles.spanPointer}`].join(' ')}>
                  {phoneLoginWay === 1 ?
                    (<span onClick={() => setPhoneWay(0)}>
                      <FormattedMessage id="pages.login.phonePasswordLogin" defaultMessage="手机号密码登录" />
                    </span>) : phoneLoginWay === 0 ?
                      (<span onClick={() => setPhoneWay(1)}>
                        <FormattedMessage id="pages.login.messageCaptcha" defaultMessage="短信验证码登录" />
                      </span>) : ''
                  }
                </span>
              </span>
            )}
          </div>
        </div>
      </ProForm>
      <div>
        <div className={styles.widthContent}
          style={{
            marginTop: 24
          }}
        >
          <span className={styles.textWhite}>
            <FormattedMessage id="pages.login.notjoin" defaultMessage="还未加入我们?" />
          </span>
          <Link to={{
            pathname: '/user/register'
          }}>
            <span className={[`${styles.textYellow}`, `${styles.spanPointer}`].join(' ')}>
              <FormattedMessage id="pages.login.immediatelyRegister" defaultMessage="立即注册" />
            </span>
          </Link>
          <Link to={{
            pathname: '/user/forgetPassword'
          }}>
            <span
              style={{
                float: 'right',
              }}
              className={[`${styles.textYellow}`, `${styles.spanPointer}`].join(' ')}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />

            </span>
          </Link>
        </div>
      </div>
      <div>
        <div className={styles.widthContent}
          style={{
            marginTop: 48,
            marginBottom: 48
          }}
        >
          <span className={styles.textWhite}>
            <FormattedMessage id="pages.login.clickAgreeInfo" defaultMessage="点击登录即表示您同意" />
          </span>
          <span className={styles.textYellow}>
            <FormattedMessage id="pages.login.userTerms" defaultMessage="用户条款和条件" />
            <span style={{ 'color': 'white' }}>
              <FormattedMessage id="pages.login.asWell" defaultMessage="以及" />
            </span>
            <FormattedMessage id="pages.login.privacyPolicy" defaultMessage="隐私政策" />
          </span>
        </div>
      </div>
    </div >
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
