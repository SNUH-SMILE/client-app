export default class logger {
  constructor(type) {
    this.type = type;
  }

  info(...args) {
    console.info(`[${this.type}]`, ...args);
  }

  warn(...args) {
    console.warn(`[${this.type}]`, ...args);
  }
  log(...args) {
    console.log(`[${this.type}]`, ...args);
  }
}
