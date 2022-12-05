import _remove from 'lodash/remove';
import { extend } from '@/native';

const restoreEvents = [];

export const BIND_RESTORE_EVENT = 'bindRestoreEvent';
extend(BIND_RESTORE_EVENT, (callback) => {
  if (typeof callback !== 'function') {
    throw new Error(BIND_RESTORE_EVENT + ' was Only Function');
  }
  restoreEvents.push(callback);
});

export const UNBIND_RESTORE_EVENT = 'unBindRestoreEvent';
extend(UNBIND_RESTORE_EVENT, (target) => {
  _remove(restoreEvents, (i) => i === target);
});

M.onRestore(function () {
  restoreEvents.forEach((cb) => {
    cb();
  });
});
