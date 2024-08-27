import GradeThresholds from './grade-thresholds.interface';

export const gradeThresholds: GradeThresholds = {
  so2: {
    1: { min: 0, max: 0.02 },
    2: { min: 0.03, max: 0.05 },
    3: { min: 0.06, max: 0.15 },
    4: { min: 0.16, max: 0.6 },
    5: { min: 0.61, max: Infinity },
  },
  co: {
    1: { min: 0, max: 2 },
    2: { min: 2.1, max: 9 },
    3: { min: 9.1, max: 15 },
    4: { min: 15.1, max: 32 },
    5: { min: 32.1, max: Infinity },
  },
  no2: {
    1: { min: 0, max: 0.03 },
    2: { min: 0.03, max: 0.06 },
    3: { min: 0.07, max: 0.2 },
    4: { min: 0.21, max: 1.1 },
    5: { min: 1.2, max: Infinity },
  },
  o3: {
    1: { min: 0, max: 0.03 },
    2: { min: 0.03, max: 0.09 },
    3: { min: 0.1, max: 0.15 },
    4: { min: 0.16, max: 0.38 },
    5: { min: 0.39, max: Infinity },
  },
  pm10: {
    1: { min: 0, max: 30 },
    2: { min: 31, max: 50 },
    3: { min: 51, max: 100 },
    4: { min: 101, max: 150 },
    5: { min: 151, max: Infinity },
  },
  pm25: {
    1: { min: 0, max: 15 },
    2: { min: 16, max: 25 },
    3: { min: 26, max: 50 },
    4: { min: 51, max: 75 },
    5: { min: 76, max: Infinity },
  },
};
