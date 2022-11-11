/**
 *
 * BlueTooth 관련
 * 디바이스 연결
 */

import { RUNTIME } from '@/common/config';
import { APP_ENV } from '@/common/constants';
import Logger from '@/utils/logger';
import { extend } from '.';

let _scanCallback = null;

const CB_BAND_SCAN = '__CB_BAND_SACN';

const logger = new Logger('Native Bluetooth');

window[CB_BAND_SCAN] = function (result) {
  logger.info('CB_BAND_SCAN : ', result);
  // TODO : 필요한 경우 데이터 핸들러 작성
  if (typeof _scanCallback === 'function') {
    _scanCallback(result);
  } else {
    logger.warn('unBind Callback : "_scanCallback"');
  }
};

export const ON_BAND_SCAN = 'onBandScan';
extend(ON_BAND_SCAN, (cb) => {
  _scanCallback = cb;
  if (RUNTIME.TYPE === APP_ENV.APP) {
    M.execute('exBandScan', {
      schBluetooth: 'C',
      callback: CB_BAND_SCAN,
    });
  }
});

export const OFF_BAND_SCAN = 'offBandScan';
extend(OFF_BAND_SCAN, () => {
  _scanCallback = null;
  M.execute('exBandScanStop');
});
