import { sendHttp } from '@/common/mapi.js';

export default class BaseApiService {
  constructor(resource) {
    this.sendHttp = sendHttp;
    this.resource = resource;
  }

  post(path = '', data = {}) {
    const options = {};
    options.path = `${this.resource}${path}`;
    options.data = data;
    return sendHttp(options);
  }
  //   get(path = '', params = {}, config = {}) {
  //     return this.instance.get(`${this.resource}${path}`, { params, ...config });
  //   }
  //   patch(path = '', params = {}, config = {}) {
  //     return this.instance.patch(`${this.resource}${path}`, params, config);
  //   }
  //   delete(path = '', params = {}, config = {}) {
  //     return this.instance.delete(`${this.resource}${path}`, params, config);
  //   }
}
