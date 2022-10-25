import _merge from 'lodash/merge';

const INIT_PAGE_META = () => ({
  headerLine: true,
  headerType: 'back',
  headerTitle: '',
  warpCls: '',
  title: '',
  showTopBtn: false,
  keepAlive: false,
});

export const NO_LINE_PAGES = ['terms', 'find', 'find-pw', 'target-check'];
export const FULL_POPUP_PAGES = [
  'customer-inquiry-id',
  'customer-inquiry-write',
  'customer-notice-id',
  'medicine-setting',
  'medicine-no-alarm-check',
  'exercise-setting',
  'exercise-video',
  'terms-id',
];
export const NAV_PAGE_PAGES = ['home'];

export const TOP_BTN_PAGES = ['exercise', 'customer-inquiry', 'home', 'customer-notice'];

export const KEEP_ALIVE_PAGES = ['home'];

export default (to, from) => {
  const { name } = to;

  const metas = INIT_PAGE_META();
  if (NO_LINE_PAGES.includes(name)) {
    metas.headerLine = false;
  }
  if (TOP_BTN_PAGES.includes(name)) {
    metas.showTopBtn = true;
  }
  if (KEEP_ALIVE_PAGES.includes(name)) {
    metas.keepAlive = true;
  }
  if (FULL_POPUP_PAGES.includes(name)) {
    metas.headerType = 'close';
    metas.warpCls = 'pg-fp';
  } else if (NAV_PAGE_PAGES.includes(name)) {
    metas.headerType = 'nav';
    metas.warpCls = 'pg-main';
  }
  _merge(metas, to.meta);
  _merge(to.meta, metas);
  // if (!to.meta.title) from.meta.title;
};
