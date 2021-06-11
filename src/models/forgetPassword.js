import { findPassWordByEmail, findPassWordByPhone } from '@/services/forgetPassword';
import { getAuthority } from '@/utils/authority';
import { message } from 'antd';

const Model = {
  namespace: 'forgetPassword',
  state: {
    status: undefined,
  },
  effects: {
    *forgetPasswordByMail({ payload }, { call, put }) {
      const response = yield call(findPassWordByEmail, payload);
      if (response.state) {
        if (localStorage.umi_locale === "zh-CN") {
          message.success('找回密码成功')
        } else {
          message.success('Password retrieved successfully')
        }
      } else {
        message.error(response.message)
      }
      yield put({
        type: 'changeForgetStatus',
        payload: response,
      });
    },
    *forgetPasswordByPhone({ payload }, { call, put }) {
      const response = yield call(findPassWordByPhone, payload);
      if (response.state) {
        if (localStorage.umi_locale === "zh-CN") {
          message.success('找回密码成功')
        } else {
          message.success('Password retrieved successfully')
        }
      } else {
        message.error(response.message)
      }
      yield put({
        type: 'changeForgetStatus',
        payload: response,
      });
    }
  },

  reducers: {
    changeForgetStatus(state, { payload }) {
      return { ...state, status: payload.state, type: payload.type };
    },
  },
};
export default Model;
