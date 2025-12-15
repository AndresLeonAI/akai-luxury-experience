export const EASING = {
  luxury: [0.16, 1, 0.3, 1] as const, // The "Akai" signature ease
  sharp: [0.22, 1, 0.36, 1] as const,
  smooth: [0.33, 1, 0.68, 1] as const,
};

export const DURATION = {
  fast: 0.3,
  medium: 0.6,
  slow: 0.9,
  glacial: 1.5,
};

export const DELAY = {
  stagger: 0.08,
  page: 0.2,
};