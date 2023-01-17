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
          resolve({ code, message, result });
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

export const addSeersAccount = async (loginId, seersAccount) => {
  const { code, message, result } = await oauthHttp('/garmin/user/seers/add', { loginId, deviceId: loginId, additionUserCode: seersAccount });
  return { code, message, result };
};

export const garminWorkerDelete = async (loginId) => {
  const { code, message, result } = await oauthHttp('/garmin/user/delete', { loginId });
  return { code, message, result };
};

/**
 * 주소를 사용한 위도 경도 조회 API
 * with. Google Map
 */

export const getCoordinate = (address) => {
  const google = window.google;
  return new Promise((resolve, reject) => {
    let lat = null,
      lng = null;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (result, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        lat = result[0]['geometry']['location']['lat']();
        lng = result[0]['geometry']['location']['lng']();
      } else {
        this.$alert('Geocode was not successful for the followingreason: ' + status);
      }
      resolve({ lat, lng });
    });
  });
};
