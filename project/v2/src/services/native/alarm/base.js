import { executor } from '@/native';
import { DB_CLOSE, DB_CONNECT, DB_QUERY } from '@/native/db';

// TODO : Logger
export class BaseAlarmService {
  dbPath = './localpush.db'; // TODO : 로컬 푸쉬 파일 경로 상수로 관리
  constructor() {}
  connect() {
    return executor(DB_CONNECT, this.dbPath);
  }

  query(sql) {
    return executor(DB_QUERY, this.dbPath, sql);
  }

  close() {
    return executor(DB_CLOSE, this.dbPath);
  }
  sync() {
    // TODO : 로컬 푸시에 대한 싱크 요청
  }
}
