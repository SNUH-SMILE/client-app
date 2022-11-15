/**
 * 싱크 관련
 */
import { RUNTIME } from '@/common/config';
import { APP_ENV } from '@/common/constants';
import Logger from '@/utils/logger';
import { extend } from '.';
const logger = new Logger('Sync');

export const CB_SYNC_SERVER_DATA = 'exServerSyncDataFinish';
window[CB_SYNC_SERVER_DATA] = () => {
  // TODO : 싱크 콜백함수 작성
};
/**
 * 서버 동기화할 데이터 조회
 */
export const ON_SYNC_SERVER_DATA_SEARCH = 'onSyncServerDataSearch';
extend(ON_SYNC_SERVER_DATA_SEARCH, () => {
  if (RUNTIME.TYPE === APP_ENV.APP) {
    M.execute('exServerSyncData', CB_SYNC_SERVER_DATA);
  }
});

/**
 *서버 동기화 완료 표시
 */
export const IS_SYNC_SERVER_DATA = 'isSyncServerData';
extend(IS_SYNC_SERVER_DATA, () => {
  if (RUNTIME.TYPE === APP_ENV.APP) {
    M.execute('exServerSyncDataFinish');
  }
});

/**
 * 데이터 동기화
 * @param {Boolean} flag
 */
export const ON_SYNC_DATA = 'onSyncData';
extend(ON_SYNC_DATA, (flag) => {
  if (RUNTIME.TYPE === APP_ENV.APP) {
    M.execute('exBandAllDataSync', flag);
  }
});
