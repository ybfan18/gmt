import { stringify } from 'querystring';
import { accountRegister } from '@/services/register';
import { message } from 'antd';
const Model = {
  namespace: 'register',
  state: {
    status: undefined,
  },
  effects: {
    *register({ payload, callback }, { call, put }) {
      const response = yield call(accountRegister, payload);
      yield put({
        type: 'changeRegisterStatus',
        payload: response,
      }); // Register successfully

      if (!response.state) {
        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
      } else {
        message.error(response.message);
      }
    },
  },
  reducers: {
    changeRegisterStatus(state, { payload }) {
      return { ...state, status: payload.state, type: payload.type };
    },
  },
};
export default Model;
