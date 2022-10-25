import './rules';
import './locales/ko';
import { localize, ValidationObserver } from 'vee-validate';

// ValidateionObserver 확장
/**
 * anyError
 * @function
 * @return string Error Message 리턴 또는 undefiend
 */
ValidationObserver.prototype.anyError = function () {
  const keys = Object.keys(this.errors);
  for (let i = 0; i < keys.length; i += 1) {
    if (this.errors[keys[i]][0] !== undefined) {
      return this.errors[keys[i]][0];
    }
  }
  return undefined;
};

// 로컬 라이즈 기본 세팅
localize('ko');
