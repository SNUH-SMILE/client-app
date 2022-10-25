import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
// 모든 룰을 사용
Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

// 룰 커스텀 확장
extend('verify_password', {
  validate: (value) => {
    const reg = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    return reg.test(value);
  },
});

extend('rate_code', {
  validate: (value) => {
    const reg = /[A-Z]{2,2}/;
    return reg.test(value);
  },
});

extend('optional_required', {
  validate: (value, args) => {
    const keys = Object.keys(args).filter((key) => typeof args[key] === 'string');
    let result = value;
    keys.map((key) => (result += args[key]));
    result = result.trim();
    return result.length > 0;
  },
  params: [
    { name: 'arg1', isTarget: true },
    { name: 'arg2', isTarget: true },
    { name: 'arg3', isTarget: true },
    { name: 'arg4', isTarget: true },
    { name: 'arg5', isTarget: true },
  ],
  computesRequired: true,
});

extend('ko_phone', {
  validate: (value) => {
    const reg = /(02|0[3-9]{1}[0-9]{1})([\-\.])?[1-9]{1}[0-9]{2,3}([\-\.])?[0-9]{4}$/;
    return reg.test(value);
  },
});
