/**
 * DB 관련 API 선언
 */

import { extend } from '.';
import { STATUS } from './constants';

/**
 * DB 열기
 *  * @param {String} dbName
 */

/**
 * 절차
 * create - open - query - close
 * create-> 응답 exist -> open -> close
 *
 * 구현 connect - query - close
 */

const createDb = (path) => {
  return new Promise((resolve, reject) => {
    M.db.create(path, function (status, error) {
      const err = error && typeof error === 'string' ? error : error.message || '';
      if (status === STATUS.FAIL && !err.includes('already')) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const openDb = (path) => {
  return new Promise((resolve, reject) => {
    M.db.open({
      path,
      callback: function (status, error) {
        const err = error && typeof error === 'string' ? error : error.message || '';
        if (status === STATUS.FAIL && !err.includes('already')) {
          reject(error);
        } else {
          resolve();
        }
      },
    });
  });
};

export const DB_CONNECT = 'dbConnect';

extend(DB_CONNECT, (path) => {
  return new Promise((resolve, reject) => {
    // createDb(path)
    //   .then(() => openDb(path))
    //   .then(() => resolve())
    //   .catch((err) => reject(err));
    openDb(path)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
});

export const DB_QUERY = 'dbQuery';
extend(DB_QUERY, (path, query) => {
  return new Promise((resolve, reject) => {
    M.db.execute({
      path,
      sql: query,
      callback: function (status, result) {
        if (status === STATUS.SUCC) {
          // 필요한 경우 adapter 작성
          resolve(result);
        } else {
          reject(result);
        }
      },
    });
  });
});

export const DB_CLOSE = 'dbClose';
extend(DB_CLOSE, (path) => {
  return new Promise((resolve, reject) => {
    M.db.close({
      path,
      callback: function (status, result) {
        if (status === STATUS.SUCC) {
          resolve();
        } else {
          reject();
        }
      },
    });
  });
});
