import { stringify } from 'querystring';
import { history } from 'umi';
import { accountLogin, loginOut } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, setCookie, removeCookie } from '@/utils/utils';
import { message } from 'antd';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload.params);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.state) {
        //记住密码
        if (payload.autoLoginParam.autoLogin) {
          setCookie('username', payload.params.info, 1)
          setCookie('password', payload.params.password, 1)
        } else {
          removeCookie('username')
          removeCookie('password')
        }
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('登录成功！');
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (window.routerBase !== '/') {
              redirect = redirect.replace(window.routerBase, '/');
            }

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      } else {
        message.error(response.message)
      }
    },

    *logout({ payload }, { call, put }) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      yield call(loginOut, payload);

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data);
      return { ...state, status: payload.state, type: payload.type };
    },
  },
};
export default Model;
