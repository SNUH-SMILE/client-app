import { sendHttp } from '@/common/mapi.js';
/**
 * @describe user 서버 통신 api
 * @param {object} payload
 */
const patientLogin = function (payload) {
  sendHttp(payload);
};

export default {
  patientLogin,
};