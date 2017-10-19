import MobileDetect from 'mobile-detect';

const md = new MobileDetect(window.navigator.userAgent);

export function isMobile() {
  return !!md.mobile();
}
