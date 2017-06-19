export const TIPS_BALLOON_DISMISS = 'TIPS_BALLOON_DISMISS';

export function dismissTipsBalloon(id) {
  return {
    type: TIPS_BALLOON_DISMISS,
    id,
  };
};
