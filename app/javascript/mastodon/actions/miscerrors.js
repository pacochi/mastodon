export const MISC_FAIL = 'MISC_FAIL';
export function miscFail(error) {
  console.log(error);
  return {
    type: MISC_FAIL,
    error,
  };
};
