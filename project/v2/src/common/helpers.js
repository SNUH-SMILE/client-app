import Vue from 'vue';
import { executor } from '@/native';
import { HTTP_SEND } from '@/native/net';
import { OAUTH_SERVER_NAME } from './config';
import Logger from '@/utils/logger';

/**
 * 모바일 인증 관련 함수
 */

const logger = new Logger('OAuth Http Send');
const oauthHttp = (path, data) => {
  return new Promise((resolve, reject) => {
    const loading = Vue.$loading();
    logger.info(`PATH :: ${path}`);
    logger.info(`BODY :: \n ${JSON.stringify(data, null, 4)}`);
    executor(HTTP_SEND, {
      server: OAUTH_SERVER_NAME,
      path,
      data,
    })
      .then(({ code, message, result }) => {
        if (code === 200) {
          resolve({ code, message, result });
        } else {
          Vue.$alert(`${message}(<span style="color:red;display: inline;">${code}</span>)`);
          reject(code, message);
        }
      })
      .catch((code) => {
        Vue.$alert(`ERROR CODE : ${code}`);
        reject(code);
      })
      .finally((...args) => {
        logger.info(` RESPONSE ::  `, args);
        loading.$hide();
      });
  });
};

export const mobileAuthOpen = async () => {
  const {
    result: { cpid, encryptedRequestInfo },
  } = await oauthHttp('/garmin/idverif/init', {});
  const pathnameArr = location.pathname.split('/');
  pathnameArr.pop();
  pathnameArr.push('authReturn.html');
  const returnUrl = location.origin + pathnameArr.join('/');
  const url = 'https://www.mobile-ok.com/popup/common/hscert.jsp';
  const querys = '?cpid=' + cpid + '&req_info=' + encryptedRequestInfo + '&rtn_url=' + encodeURIComponent(returnUrl);
  M.page.html({
    url: url + querys,
    orientation: 'PORT',
    action: 'NO_HISTORY',
  });
};

export const decryptMobileAuth = async (priinfo) => {
  const { code, message, result } = await oauthHttp('/garmin/idverif/decrypt', { priinfo });
  return result;
};
