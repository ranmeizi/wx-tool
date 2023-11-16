import { EventNames } from './custom.events';
import MfTracking from './impls/mf';
import UmaTracking from './impls/uma';
import { Agent } from './tool/Agent';

export type TrackingProperties = Partial<{
  /** 事件名称，必填 */
  event: EventNames;
  /**
   * [可选] 页面id
   * @description 页面id，可选，若不传，默认当前页面触发，取linknode维护的curr id
   *
   * [LinkNode](./tool/LinkNode.ts)
   */
  pageid: string;
  /** [可选]上一个页面的pageId，一般来说不写，由linknode维护  */
  ref: string;
  /**
   * [可选]子事件
   * @description 友盟埋点时，ctrl会拼接到事件名后面
   */
  ctrl: string;
  /** [可选]用户id，一般在登陆状态发生改变时由 setAccount 填写 */
  uid: string | number;
  /** [可选]时间戳，一般由 track 函数获取 只有mf埋点需要 */
  ts: string;
  /** [可选]大版本，一般由 setGlobalData 填写 */
  ver: string;
  /** [可选]渠道码，一般由 setGlobalData 填写，默认值为 mini_program */
  chn: string;
  /** [可选]唯一标识id 一般是前端生成一个缓存storage的uuid，可以接受小概率不唯一 */
  did: string;
  /** [可选] 原子id，比如：文章id，基金代码等等 */
  oid: string;
  /** [可选] 筛选标签 根绝业务需求定 */
  tag: string;
  /** 离开页面时间戳 - 进入页面的时间戳 , 可以采用页面挽留类似方案监控 */
  staytime: string;
}>;

// 埋点各家实现
const mf = new MfTracking();
const uma = new UmaTracking();

const agent = new Agent<TrackingProperties>();

// use controller 使用 agent 调用埋点api
agent.use(() => mf);
agent.use(() => uma);

// 初始化
agent.duration.createGroup('pageStay');

export default agent;
