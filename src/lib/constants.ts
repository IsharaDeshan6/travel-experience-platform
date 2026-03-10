export const CATEGORIES = [
  "Adventure",
  "Culture",
  "Food",
  "Nature",
  "Sports",
  "Wellness",
  "Beach",
  "City Tours",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MIN_DESCRIPTION_LENGTH = 20;
export const MIN_PASSWORD_LENGTH = 8;
