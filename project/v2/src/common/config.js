import { ENUM_APP_ENV, ENUM_OS_ENV } from './constants';

const { NODE_ENV, BASE_URL, VUE_APP_API_URL, VUE_APP_API_SERVER_NAME, VUE_APP_OAUTH_API_URL, VUE_APP_OAUTH_SERVER_NAME } = process.env;

const initRunTimeEnv = () => {
  let OS;
  const userAgent = window.navigator.userAgent;
  const TYPE = /morpheus/i.test(userAgent) ? ENUM_APP_ENV.APP : ENUM_APP_ENV.BROWSER;
  if (/android/i.test(userAgent)) {
    OS = ENUM_OS_ENV.ANDROID;
  } else if (/ipad|iphone|ipod/i.test(userAgent) && !window.MSStream) {
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    OS = ENUM_OS_ENV.IOS;
  } else {
    OS = ENUM_OS_ENV.UNKOWN;
  }
  return {
    TYPE,
    OS,
  };
};

export const MODE = NODE_ENV;
export const API_URL = VUE_APP_API_URL;
export const RUNTIME = initRunTimeEnv();
export const SERVER_NAME = VUE_APP_API_SERVER_NAME;
export const OAUTH_API_URL = VUE_APP_OAUTH_API_URL;
export const OAUTH_SERVER_NAME = VUE_APP_OAUTH_SERVER_NAME;
export const PUBLIC_PATH = BASE_URL;
