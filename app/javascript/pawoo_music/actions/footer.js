export const FOOTER_CHANGE_TYPE = 'FOOTER_CHANGE_TYPE';

export function changeFooterType(footerType, backTo = null) {
  return {
    footerType,
    backTo,
    type: FOOTER_CHANGE_TYPE,
  };
};
