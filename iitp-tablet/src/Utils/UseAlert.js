import {useContext} from "react";
import {AlertContext} from "../Providers/AlertContext";
import {SHOW_ALERT, SHOW_CONFIRM, HIDE} from "../Providers/AlertReducer";

let resolveCallback;
function useAlert() {
    const [alertState, dispatch] = useContext(AlertContext);
    const onConfirm = () => {
        close();
        resolveCallback(true);
    };

    const onCancel = () => {
        close();
        resolveCallback(false);
    };
    const confirm = text => {
        dispatch({
            type: SHOW_CONFIRM,
            payload: {
                text
            }
        });
        return new Promise((res, rej) => {
            resolveCallback = res;
        });
    };
    const alert = text => {
        dispatch({
            type: SHOW_ALERT,
            payload: {
                text
            }
        });
    };

    const close = () => {
        dispatch({
            type: HIDE
        });
    };

    return { confirm, alert, close, onConfirm, onCancel, alertState };

}

export default useAlert;



