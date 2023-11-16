import * as eventTypes from './EVENT_TYPES';

type Fn = (...arg: any[]) => any;

type Events = {
  [key: string]: Fn[];
};

export interface EventBus {
  TYPES: typeof eventTypes;
}

export class EventBus {
  static TYPES = eventTypes;

  private events: Events = {};

  on(name: string, fn: Fn) {
    if (this.events[name]?.length > 0) {
      this.events[name].push(fn);
    } else {
      this.events[name] = [fn];
    }
  }

  un(name: string, fn: Fn) {
    if (typeof name === 'string' && !this.events[name]) {
      return console.warn(
        `enentbus error,eventname:${String(name)} is not in enents`
      );
    }

    const index = this.events[name].findIndex((item) => item === fn);

    if (index < 0) {
      return console.warn('enentbus error,un can`t find fn in events');
    }

    this.events[name].splice(index, 1);
  }

  emit(name: string, data: any) {
    if (typeof name === 'string' && !this.events[name]) {
      return console.warn(
        `enentbus error,eventname:${String(name)} is not in enents`
      );
    }

    this.events[name].forEach((fn) => fn(data));
  }

  promiseAllEmit(name: string, data: any) {
    if (typeof name === 'string' && !this.events[name]) {
      return console.warn(
        `enentbus error,eventname:${String(name)} is not in enents`
      );
    }

    const actions = this.events[name]
      .map((fn) => fn(data))
      .filter((r) => r instanceof Promise);

    return Promise.all(actions);
  }
}

EventBus.prototype.TYPES = eventTypes;

export default new EventBus();
