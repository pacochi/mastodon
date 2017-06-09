export const FAIL_MISC_ERROR = 'FAIL_MISC_ERROR';
export function failMiscError(error) {
  return {
    type: FAIL_MISC_ERROR,
    error
  };
};
