import { env, os } from '@/common/config.js';
/**
 * @describe 기본 브라우저 factory
 */
function defaultBrowser(options) {
  console.warn('Default browser ');
}

/**
 *
 * @param {object} options
 * @param {Function} options.android
 * @param {Function} options.ios
 * @param {Function} options.browsers
 * @param {object} options.params
 */
function factoryFunc(options) {
  if (env === 'browser') {
    // return options.android;
    return options.browser || defaultBrowser();
  } else return options[os] || options.android;
}

export const factory = factoryFunc;
