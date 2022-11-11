const DEFAULT_CB_NM = '__defaultQueryCB';

window[DEFAULT_CB_NM] = (...args) => {
  console.log(...args);
};
/**
 * DB 열기
 *  * @param {String} dbName
 */
const connectDB = function (dbName) {
  M.db.open({
    path: dbName,
    callback: function (...args) {
      console.log(...args);
    },
  });
};

/**
 * DB 생성
 * @param {String} dbName
 */
const createDB = function (dbName) {
  M.db.create(dbName, function (status, name) {
    // console.log(status, name);
  });
};

/**
 *  DB query 실행
 * @param {String} query
 */
const queryDB = function (query, callback) {
  M.db.execute({
    path: '/ALARM.db',
    sql: query,
    callback: window[callback],
  });
};

export default function insertService(items, callback) {
  console.log(callback);
  const dbName = 'ALARM'; // 현재 하나의 db 만 접근함
  connectDB(dbName);
  createDB(dbName); // DB 무조건 생성 >> 실패하면 테이블이 존재하는것.
  const create = `CREATE TABLE ALARM (type varchar2,time datetime,seq varchar2);`; // time : YYYY-MM-DD hh:mm:ss
  queryDB(create, DEFAULT_CB_NM);

  const query = `INSERT INTO ${dbName}(type, time, seq) VALUES('${items.type}','${items.time}','${items.seq}');`;
  queryDB(query, DEFAULT_CB_NM);

  const select = `SELECT * FROM ${dbName};`;
  queryDB(select, callback);
  // const query = `DROP TABLE ALARM;`;
  // queryDB(query);
}
