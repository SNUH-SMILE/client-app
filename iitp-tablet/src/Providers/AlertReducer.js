export const SHOW_ALERT = 'SHOW_ALERT';
export const SHOW_CONFIRM = 'SHOW_CONFIRM';
export const HIDE = 'HIDE';

export const alertInitialState = {
    show: false,
    mode: 'alert',
    text: ''
};

export const alertReducer = (state = alertInitialState, action) => {
    switch (action.type) {
        case SHOW_CONFIRM:
            return {
                show: true,
                mode: 'confirm',
                text: action.payload.text
            };
        case SHOW_ALERT:
            return {
                show: true,
                mode: 'alert',
                text: action.payload.text
            };
        case HIDE:
            return alertInitialState;
        default:
            return alertInitialState;
    }
};