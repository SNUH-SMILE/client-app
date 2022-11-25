import httpSend from '@/common/httpSend';

export default class BaseApiService {
  constructor(resource) {
    this.httpSend = httpSend;
    this.resource = resource;
  }

  post(path = '', data = {}) {
    return this.httpSend(`${this.resource}${path}`, data);
  }
}
