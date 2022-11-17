import Vue from 'vue';
import { executor } from '@/native';
import { HTTP_SEND } from '@/native/net';
import store from '@/store';
import { ACCESS_TOKEN } from '@/modules/patient';
import Logger from '@/utils/logger';
import { RESPONSE_STATUS } from './constants';

const logger = new Logger('HttpSend');

const httpSend = (path, data = {}) => {
  return new Promise((resolve, reject) => {
    const loading = Vue.$loading();
    const token = store.getters[ACCESS_TOKEN];
    logger.info(`PATH :: ${path}`);
    logger.info(`BODY :: \n ${JSON.stringify(data, null, 4)}`);
    executor(HTTP_SEND, {
      path,
      data,
      userData: {
        token,
      },
    })
      .then(({ code, message, ...data }) => {
        console.log(code, message, data);
        if (code === RESPONSE_STATUS.SUCCESS) {
          resolve({ code, message, data });
        } else {
          Vue.$alert(`${message}(<span style="color:red;display: inline;">${code}</span>)`);
          reject(code, message);
        }
      })
      .catch((code) => {
        Vue.$alert(`ERROR CODE : ${code}`);
        reject(code);
      })
      .finally(() => {
        loading.$hide();
      });
  });
};

export default httpSend;

// TODO : 디버깅용 데이터 확인 후 삭제 필요
window.httpSend = httpSend;
