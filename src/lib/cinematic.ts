type CinematicEventDetail = {
  themeColor: string;
};

export const dispatchCutToProject = (themeColor: string) => {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent<CinematicEventDetail>('cut-to-project', {
    detail: { themeColor },
  });
  window.dispatchEvent(event);
};

export const dispatchExitProject = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('exit-project'));
};
