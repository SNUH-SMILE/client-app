import { factory } from '@/services/native/nativeFactory.js';

function getPushPermissionFunc() {
  console.log('푸시 서비스 등록');
  // M.plugin('push').remote.registerService({
  //   callback: function (result, setting) {
  //     if (result.status == 'SUCCESS') {
  //       console.log('서비스 등록을 성공 하였습니다.');
  //     } else {
  //       console.log('서비스 등록을 실패 하였습니다.');
  //     }
  //   },
  // });
  return true;
}

export const getPushPermissionService = factory({ android: getPushPermissionFunc });
