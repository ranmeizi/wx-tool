// 埋点
export abstract class TrackingTrait<T = any> {
  /** 初始化函数 */
  abstract initialize(): void;

  /** 埋点 */
  abstract track(data: T): void;

  /** 设置全局数据,会随着track记录发送 */
  abstract setGlobal(arg: SetGlobal<T>): void;

  /** 设置用户数据,会随着track记录发送 */
  abstract setAccount(arg: SetGlobal<T>): void;
}

type setGlobalDataFn<T> = (data: T) => T;

export type SetGlobal<T = any> = setGlobalDataFn<T> | T;
