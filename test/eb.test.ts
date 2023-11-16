import { jest, describe, expect, test } from '@jest/globals';
import { EventBus } from '../src/utils/EventBus/index';

const test1 = new EventBus();

describe('EventBus test', () => {
  test('EventBus.on test', () => {
    const test1Fn = jest.fn((data) => data);
    const test2Fn = jest.fn((data) => data);
    const test3Fn = jest.fn((data) => data);
    test1.on('event1', test1Fn);
    test1.on('event1', test2Fn);
    test1.on('event2', test3Fn);

    // 触发event1 期望test1Fn与test2Fn被调用，而test3Fn不被调用，并data传入正确

    test1.emit('event1', 'test1');

    expect(test1Fn.mock.calls.length).toBe(1);
    expect(test1Fn.mock.results[0].value).toBe('test1');
    expect(test2Fn.mock.calls.length).toBe(1);
    expect(test2Fn.mock.results[0].value).toBe('test1');
    expect(test3Fn.mock.calls.length).toBe(0);
  });
  test('EventBus.un test', async () => {
    const test1Fn = jest.fn((data) => data);
    const test2Fn = jest.fn((data) => data);
    test1.on('event1', test1Fn);
    test1.on('event1', test2Fn);
    test1.un('event1', test2Fn);

    // 添加test2Fn监听后un掉fn2的监听，再去触发event1

    test1.emit('event1', 'test1');

    expect(test1Fn.mock.calls.length).toBe(1);
    expect(test1Fn.mock.results[0].value).toBe('test1');
    expect(test2Fn.mock.calls.length).toBe(0);
  });

  function sleep(timeout: number) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, timeout);
    });
  }

  // refresh 用的 promise emit
  test('EventBus.promiseAllEmit', async () => {
    // 耗时1秒
    const refresh1 = () => sleep(1000);

    // 耗时3秒
    const refresh2 = () => sleep(3000);

    const 捣乱的 = function () {};

    test1.on('refresh', refresh1);
    test1.on('refresh', refresh2);
    test1.on('refresh', 捣乱的);

    const start = Date.now();
    const action = test1.promiseAllEmit('refresh', {})!;

    // 并发应该是3000
    return action.then((res) => {
      // 计算时间
      const duration = Date.now() - start;

      // -10
      expect(duration).toBeGreaterThanOrEqual(2990);
      // +10
      expect(duration).toBeLessThanOrEqual(3010);
    });
  });
});
