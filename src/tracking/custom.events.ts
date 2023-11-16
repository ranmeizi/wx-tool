/**
 * 魔方的统计约定的一些标准事件
 */
const Events = {
  load: 'load',
  click: 'click',
  cancel: 'cancel',
  succ: 'succ',
  fail: 'fail',
  longPress: 'longPress',
  popModel: 'popModel',
  show: 'show',
  share: 'share',
};

export type EventNames = keyof typeof Events;

export const umaEventMap: Record<EventNames, string> = {
  load: 'Um_Event_PageView',
  click: 'Um_Event_Click',
  cancel: 'Um_Event_Cancel',
  succ: 'Um_Event_Succ',
  fail: 'Um_Event_Fail',
  longPress: 'Um_Event_LongPress',
  popModel: 'Um_Event_PopModel',
  show: 'Um_Event_Show',
  share: 'Um_Event_Share',
};
