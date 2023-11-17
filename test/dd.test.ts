import { jest, describe, expect, test } from '@jest/globals';
import { normalCDF } from '../src/pages/sqsd-tool/utils';

describe('测试', () => {
  test('1', () => {
    const res = normalCDF(4.1225, 0.32, 5.151);
    console.log(res);
  });
});
