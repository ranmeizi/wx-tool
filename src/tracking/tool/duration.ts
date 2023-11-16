import { TrackingTrait } from './abstract';

type Data = any;

type SetDurationFn = (data: Data, duration: number) => Data;

type DurationOptions = {
  track: TrackingTrait['track'];
  setDuration?: SetDurationFn;
};

type GroupOptions = {
  name: string;
  track: TrackingTrait['track'];
  setDuration?: SetDurationFn;
};

export class Duration {
  options;

  constructor(options: DurationOptions) {
    this.options = options;
  }

  groups: Record<string, Group> = {};

  createGroup(name: string) {
    if (name in this.groups) {
      throw new Error('Duration.createGroup: name is existed');
    }

    this.groups[name] = new Group({
      name,
      track: this.options.track,
    });
  }
}

/**
 * 事件互斥的组，当事件 start 重复触发时，认为上一个事件结束
 * 不过也可以手动调用 end 结束事件
 */
class Group {
  options;

  data: any = {};

  startTime?: number = undefined;

  constructor(options: GroupOptions) {
    this.options = options;
  }

  private clear() {
    this.data = {};
    this.startTime = undefined;
  }

  setData(data?: any) {
    if (data && typeof data === 'object') {
      Object.assign(this.data, data);
    }
  }

  start(data: any) {
    if (this.startTime) {
      this.end();
    }

    this.startTime = Date.now();

    // 更新data
    data && this.setData(data);
  }

  end(data?: any) {
    if (!this.startTime) {
      // 无效调用
      return;
    }
    // 更新dat
    data &&
      this.setData({
        ...this.data,
        ...data,
      });

    const duration = Date.now() - this.startTime;

    // 设置duration
    if (this.setDuration) {
      this.setData(this.setDuration(this.data, duration));
    } else {
      this.setData({ ...this.data, duration });
    }

    // 发送
    this.track({
      ...this.data,
      staytime: duration,
    });

    // 清除
    this.clear();
  }

  get track() {
    return this.options.track;
  }

  get setDuration() {
    return this.options.setDuration;
  }
}
