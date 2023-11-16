// eslint-disable-next-line
import axios from 'taro-axios';
import { TrackingProperties } from '../index';
import { SetGlobal, TrackingTrait } from '../tool/abstract';
import { Stack } from '../tool/LinkNode';

let globalData = {};
const app = 5003;

function upload(params: any) {

}

export default class extends TrackingTrait<TrackingProperties> {
  initialize(): void {}
  track(data: TrackingProperties): void {
    const d = composeData(data);

    console.log(
      `%cgif 埋点日志`,
      'background:rgb(15,51,228);color:#fff;border-radius:4px;padding:4px 12px',
      `event = ${d.event}, data=`,
      d
    );
    // upload(d);
  }
  setGlobal(arg: SetGlobal): void {
    if (typeof arg === 'function') {
      globalData = arg(globalData);
    } else {
      globalData = arg;
    }
  }
  setAccount(arg: SetGlobal): void {
    if (typeof arg === 'function') {
      globalData = arg(globalData);
    } else {
      globalData = arg;
    }
  }
}

function composeData(data: any) {
  return {
    app: app,
    ts: Date.now(),
    pageid: Stack.curr?.val,
    ref: Stack.curr?.prev?.val,
    ...globalData,
    ...data,
  };
}
