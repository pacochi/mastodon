export const MISC_FAIL = 'MISC_FAIL';
export function miscFail(error) {
  return {
    type: MISC_FAIL,
    error,
  };
};
