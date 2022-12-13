/**
 * 로컬 디비 (알림 예약 기능 관련)
 */

import { RUNTIME } from '@/common/config';
import { ENUM_APP_ENV, ENUM_OS_ENV } from '@/common/constants';
import { executor, extend } from '.';
import { DB_CLOSE, DB_CONNECT, DB_QUERY } from './db';

const DB_PATH = 'SmartBand.db';

const SQL_CREATE_TB = `
CREATE TABLE IF NOT EXISTS alarm (
  id VARCHAR,
  title VARCHAR,
  body VARCHAR,
  type VARCHAR,
  time VARCHAR,
  ext VARCHAR
);
`;

const catchAsync = (func) => {
  return async (...args) => {
    try {
      return await func(...args);
    } catch (error) {
      console.warn(error);
      if (RUNTIME.OS === ENUM_OS_ENV.ANDROID) {
        await executor(DB_CONNECT, DB_PATH);
      }
      await executor(DB_QUERY, DB_PATH, SQL_CREATE_TB);
      return await func(...args);
    }
  };
};

export const REGIST_LOCAL_ALARM = 'registLocalAlarm';
extend(
  REGIST_LOCAL_ALARM,
  catchAsync(async (id, title, body, type, date, ext) => {
    const query = `
  INSERT INTO alarm
    (id, title, body, type, time, ext)
  VALUES
    ('${id}', '${title}', '${body}', '${type}', '${date}', '${JSON.stringify(ext)}')
  `;
    return await executor(DB_QUERY, DB_PATH, query);
  })
);
export const MULTI_REGIST_LOCAL_ALARM = 'multiRegistLocalAlarm';
extend(
  MULTI_REGIST_LOCAL_ALARM,
  catchAsync(async (contents) => {
    let values = [];
    contents.forEach(({ id, title, body, type, date, ext }) => {
      values.push(` ('${id}', '${title}', '${body}', '${type}', '${date}', '${JSON.stringify(ext)}') `);
    });

    const query = `
  INSERT INTO alarm
    (id, title, body, type, time, ext)
  VALUES ${values.join(', ')}
  `;
    return await executor(DB_QUERY, DB_PATH, query);
  })
);

export const SELECT_LOCAL_ALARM = `selectLocalAlarm`;
extend(
  SELECT_LOCAL_ALARM,
  catchAsync(async () => {
    const query = `
  SELECT * FROM alarm
  `;
    return await executor(DB_QUERY, DB_PATH, query);
  })
);

export const SYNC_LOCAL_ALARM = 'syncLocalAlarm';
extend(SYNC_LOCAL_ALARM, () => {
  M.execute('exWNSyncPush');
});
