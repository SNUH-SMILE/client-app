export const ENUM_APP_ENV = {
  APP: 'app', // morpheus 앱으로 접속 시 경우
  BROWSER: 'browser', // 크로스 플랫폼으로 일반 web도 지원하는 경우
};

// 모피어스 앱 내 개발환경
export const ENUM_OS_ENV = {
  IOS: 'ios', // ios
  ANDROID: 'android', // android
  UNKOWN: 'unknown',
};

export const ENUM_MODE = {
  PROD: 'production',
  DEV: 'development',
};

export const ENUM_DATE_FORMAT = {
  YMD: 'YYYYMMDD',
  MD: 'MMDD',
  Hm: 'HHmm',
  Hms: 'HHmmss',
  HH: 'HH',
  mm: 'mm',
  HyphenYmd: 'YYYY-MM-DD',
  HyphenMd: 'MM-DD',
  HyphenHm: 'HH-mm',
  HyphenHms: 'HH-mm-ss',
  PeriodYmd: 'YYYY.MM.DD',
  PeriodMd: 'MM.DD',
  PeriodHm: 'HH.mm',
  PeriodHms: 'HH.mm.ss',
  SemiHm: 'HH:mm',
  alarm: 'YYYY-MM-DD HH:mm:ss',
};

export const ENUM_ALARM_TYPE = {
  EXERCISE: 'exercise',
  MEDICINE: 'medicine',
  DOCTOR: 'doctor',
  INTERVIEW: 'interview',
  QUESTION: 'question',
};

export const ENUM_QUARANTINE = {
  YES: '0', // 정상
  NO: '1', // 이탈
};

export const ENUM_ISOLATION_TYPE = {
  UNKOWN: 'unknown',
  ISOLATION: 'isolation',
  DISCHARGE: 'discharge',
};

export const ENUM_BODY_STATUS = {
  NONE: 'none',
  BAD: 'bad',
  STAGE1: 'stage1',
  STAGE2: 'stage2',
};

export const STORAGE_KEYS = {
  TOKEN: 'jwt',
  LOGIN_ID: 'loginId',
  BODY_CHECK: 'bodyCheck', // 몸 상태 체크 상태에 대한 키
  LAST_INTERVIEW_DATE: 'lastBodyCheckDate',
  MOBILE_DATA_ALERT_YN: 'mobildDataAlert',
  SAVE_LOGIN_INPUT: 'saveLoginInput',
  LOCATION_SERVICE_CONFIG: 'LOCATION_SERVICE_CONFIG',
  LAST_ALRAM_NOTICE_CNT: 'lasAlramNoticeCnt',
  LAST_AMPM_INTERVIEW_ANSWER: 'lastAmpmInterviewAnswer',
};

export const RESPONSE_STATUS = {
  SUCCESS: '00',
  NONE_QUARANTINE: '14',
  NONE_ISOLATION: '21',
  DUPLICATE_ISOLATION: '22',
};

export const FORM_DRUG_TYPE = [
  { label: '알', value: '0' },
  { label: 'cc', value: '1' },
  { label: 'ml', value: '2' },
  { label: 'mg', value: '3' },
  { label: 'g', value: '4' },
  { label: '스푼', value: '5' },
  { label: '포', value: '6' },
];
