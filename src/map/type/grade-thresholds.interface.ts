export default interface GradeThresholds {
  [key: string]: { [grade: string]: { min: number; max: number } };
}
