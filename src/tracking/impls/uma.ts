import config from '@/configs';
import uma from 'umtrack-wx';
import { umaEventMap } from '../custom.events';
import { TrackingProperties } from '../index';
import { Stack } from '../tool/LinkNode';
import { SetGlobal, TrackingTrait } from '../tool/abstract';

let globalData = {};

export default class extends TrackingTrait<TrackingProperties> {
  initialize(): void {
    uma.init({
      appKey: config.umAppkey,
      useOpenid: false,
      autoGetOpenid: true,
      debug: false,
      uploadUserInfo: true,
      enableVerify: false,
    });
  }
  track(data: TrackingProperties): void {
    if (!data.event) {
      return;
    }
    const event = data.ctrl
      ? `${umaEventMap[data.event]}_${firstUpperCase(data.ctrl)}`
      : umaEventMap[data.event];
    const d = composeData(data);
    uma.trackEvent(event, composeData(data));
    console.log(
      `%cuma 埋点日志`,
      'background:rgb(35,130,237);color:#fff;border-radius:4px;padding:4px 12px',
      `event = ${event}, data=`,
      d
    );
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

const mapkey = {
  chn: 'Um_Key_Source',
  pageid: 'Um_Key_PageID',
  ctrl: 'Um_Key_Ctrl',
  uid: 'Um_Key_UserID',
  ver: 'Um_Key_Ver',
  oid: 'Um_Key_ItemID',
  ref: 'Um_Key_SourcePage',
  tag: 'Um_Key_Tag',
};

/**
 * chn -> Um_Key_Source
 * pageid -> Um_Key_PageID
 * ctrl -> Um_Key_Ctrl
 * uid -> Um_Key_UserID
 * ver -> Um_Key_Ver
 * oid -> Um_Key_ItemID
 * ref -> Um_Key_SourcePage
 * tag -> Um_Key_Tag
 */
function dataMapKey(data: TrackingProperties) {
  const tranform = {};
  for (let [k, v] of Object.entries(data)) {
    const key = mapkey[k];
    if (key) {
      tranform[key] = v;
    } else {
      // console.warn('tracking, fn dataMapKey,no matched key');
    }
  }
  return tranform;
}

function composeData(data: any) {
  return dataMapKey({
    pageid: Stack.curr?.val,
    ref: Stack.curr?.prev?.val,
    ...globalData,
    ...data,
  });
}

/**
 * 首字母大写
 * @param str string
 * @returns string
 */
const firstUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
