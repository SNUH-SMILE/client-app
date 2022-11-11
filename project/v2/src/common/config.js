import { APP_ENV, OS_ENV } from './constants';

const { NODE_ENV, VUE_APP_API_URL, VUE_APP_API_SERVER_NAME } = process.env;

const initRunTimeEnv = () => {
  let OS;
  const userAgent = window.navigator.userAgent;
  const TYPE = /morpheus/i.test(userAgent) ? APP_ENV.APP : APP_ENV.BROWSER;
  if (/android/i.test(userAgent)) {
    OS = OS_ENV.ANDROID;
  } else if (/ipad|iphone|ipod/i.test(userAgent) && !window.MSStream) {
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    OS = OS_ENV.IOS;
  } else {
    OS = OS_ENV.UNKOWN;
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
