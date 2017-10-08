export const FOOTER_CHANGE_TYPE = 'FOOTER_CHANGE_TYPE';

export function changeFooterType(footerType) {
  return {
    footerType,
    type: FOOTER_CHANGE_TYPE,
  };
};
