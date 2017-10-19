export const COLUMN_CHANGE_TARGET = 'COLUMN_CHANGE_TARGET';

export function changeTargetColumn(target) {
  return {
    target,
    type: COLUMN_CHANGE_TARGET,
  };
};
