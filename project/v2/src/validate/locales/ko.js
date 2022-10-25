import _merge from 'lodash/merge';
import { localize } from 'vee-validate';
import ko from 'vee-validate/dist/locale/ko.json';
// 에러메세지 정의
const _ko = _merge(ko, {
  messages: {
    verify_password: '{_field_}는 8자리 이상 영문,숫자,특수문자를 조합하여야 합니다.',
    rate_code: '{_field_}는 2자리 영어 대문자로만 입력이 가능합니다.',
    optional_required: '{_field_} 중 한가지 항목 이상은 필수 정보입니다.',
    ko_phone: '{_field_}는 올바르지 않은 전화번호 형식입니다.',
  },
});

// 한글 적용
localize({
  ko: {
    messages: _ko.messages,
  },
});
