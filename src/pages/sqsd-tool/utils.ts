import jStat from 'jstat';

export function normalCDF(mean, standardDeviation, x) {
  return jStat.normal.cdf(x, mean, standardDeviation);
}
