export const COLMUN_CHANGE_TARGET = 'COLMUN_CHANGE_TARGET';

export function changeTargetColmun(target) {
  return {
    target,
    type: COLMUN_CHANGE_TARGET,
  };
};
