export const TIMELINE_UPDATE_TITLE = 'TIMELINE_UPDATE_TITLE';

export function updateTimelineTitle(title) {
  return {
    title,
    type: TIMELINE_UPDATE_TITLE,
  };
};
