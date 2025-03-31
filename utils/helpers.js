import starsigns from "../lib/starsigns.js";

/**
 * Calculates a user's age based on their DoB and the current Date
 * @param {Date} dob - Date object from dob input
 * @returns User's age in years
 */
export const getAge = (dob) => {
  const today = Date.now();
  const diff = new Date(today - dob);
  return Math.abs(diff.getUTCFullYear() - 1970);
};

/**
 * Uses lib/starsigns to lookup the user's starsign based on their month and day of birth
 * @param {Date} dob - Date object from dob input
 * @returns User's Starsign
 */
export const getStarsign = (dob) => {
  const birthMonth = dob.getMonth();
  const starMonth = birthMonth -
    (starsigns.dateChange[birthMonth] > dob.getDate() ? 1 : 0);
  return starsigns.monthEndSign.at(starMonth);
};
