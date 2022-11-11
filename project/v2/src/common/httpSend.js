import { executor } from '@/native';
import { HTTP_SEND } from '@/native/net';

const httpSend = (path, data) => {
  return new Promise((resolve, reject) => {
    executor(HTTP_SEND, {
      path,
      data,
      userData: {
        token: '', // TODO: store.getter를 통해 가져와야함
      },
    })
      .then((...args) => {
        console.log(args);
        resolve(args);
      })
      .catch((...args) => {
        console.log(args);
        reject(args);
      });
  });
};

export default httpSend;

// TODO : 디버깅용 데이터 확인 후 삭제 필요
window.httpSend = httpSend;
