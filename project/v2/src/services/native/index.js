export function execute(key, ...args) {
  return M.execute(key, ...args);
}

export function asyncExecute(key, ...args) {
  return new Promise((resolve, reject) => {
    var callback = M.response
      .on(function (...args) {
        resolve(...args);
      })
      .toString();
    execute(key, ...args, callback);
  });
}

const _events = {};
export function bindNativeEvent(key, callback) {
  var event = M.response.on(function (...args) {
    callback(...args);
  });

  event.progressing = true;
  _events[key] = event;
  return event.toString();
}

export function unbindNativeEvent(key) {
  _events[key].expire();
  delete _events[key];
}
