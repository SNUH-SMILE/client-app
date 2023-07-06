import { useCallback, useRef } from 'react';

export default function useDoubleTap(
    callback,
    threshold = 300,
    options = {}
){
    const timer = useRef(null);

    const handler = useCallback(
        (event, ...args) => {
            if (!timer.current) {
                timer.current = setTimeout(() => {
                    if (options.onSingleTap) {
                        options.onSingleTap(event, ...args);
                    }
                    timer.current = null;
                }, threshold);
            } else {
                clearTimeout(timer.current);
                timer.current = null;
                callback && callback(event, ...args);
            }
        },
        [callback, threshold, options.onSingleTap]
    );

    return (callback
        ? {
              onClick: handler,
          }
        : {}) 
}