import Vue from 'vue';
import { executor } from '@/native';
import { HTTP_SEND } from '@/native/net';
import store from '@/store';
import { ACCESS_TOKEN } from '@/modules/patient';
import Logger from '@/utils/logger';
import { RESPONSE_STATUS } from './constants';

const logger = new Logger('HttpSend');
const PASS_STATUS = [RESPONSE_STATUS.NONE_ISOLATION, RESPONSE_STATUS.NONE_QUARANTINE, RESPONSE_STATUS.DUPLICATE_ISOLATION];
const httpSend = (path, data = {}, server) => {
  return new Promise((resolve, reject) => {
    const loading = Vue.$loading();
    const token = store.getters[ACCESS_TOKEN];
    logger.info(`PATH :: ${path}`);
    logger.info(`BODY :: \n ${JSON.stringify(data, null, 4)}`);
    executor(HTTP_SEND, {
      server,
      path,
      data,
      userData: {
        token,
      },
    })
      .then(({ code, message, ...data }) => {
        logger.info(` RESPONSE :: path : ${path} `, code, message, data);

        if (code === RESPONSE_STATUS.SUCCESS || PASS_STATUS.includes(code)) {
          resolve({ code, message, data });
        } else {
          Vue.$alert(`${message}(<span style="color:red;display: inline;">${code}</span>)`);
          resolve({ code, message, data });
        }
      })
      .catch((code) => {
        if (code != '400') {
          Vue.$alert(`ERROR CODE :  path : ${path} ${code}`);
        }
        reject(code);
      })
      .finally(() => {
        loading.$hide();
      });
  });
};

export default httpSend;
