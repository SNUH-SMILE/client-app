function defineEnv() {
  if (M.info.device() === undefined) {
    return 'browser';
  } else {
    return 'app';
  }
}

export const env = defineEnv();
export const os = (function () {
  if (defineEnv() === 'app') {
    return M.info.device().os.name.toLowerCase(); // android or ios
  } else return 'unknown';
})();
