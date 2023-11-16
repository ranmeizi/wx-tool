import { shareCard } from '@/services/active';
import Taro, { useShareAppMessage } from '@tarojs/taro';

type Options = {
  /** shareCard 的参数 (外部处理) */
  params?: Params.Active.ShareCard;
  /** 重写 path (外部处理) */
  pathRewrite?: (path: string) => string;
};

/**
 * 封装的 useShareAppMessage
 */
export default function useShareCard({
  params = getDefaultParams(),
  pathRewrite = defaultPathRewrite,
}: Options = {}) {
  useShareAppMessage(() => {
    const promise = shareCard(params).then((res) => {
      const { title, invite_img, path } = res.data.result.invite_info;
      return Promise.resolve({
        title: title,
        path: pathRewrite(path),
        imageUrl: invite_img,
      });
    });

    return {
      promise,
    };
  });
}

// 默认行为
function getDefaultParams() {
  const instance = Taro.getCurrentInstance();

  const url = instance.router!.path;

  return {
    share_page: url,
  };
}

// 默认行为
function defaultPathRewrite(path: string) {
  const instance = Taro.getCurrentInstance();
  const params = getMyParams(instance.router!.params);

  return path.indexOf('?') > -1 ? path + qs(params, true) : path + qs(params);
}

// taro 有一个 $开头的不知道啥的参数，去除掉
function getMyParams(obj: Record<string, any>) {
  const params = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    params[key] = value;
  }
  return params;
}

// to be test
export function qs(obj: Record<string, any>, notFirst?: boolean) {
  return Object.entries(obj).reduce((res, [k, v], index) => {
    if (index === 0 && !notFirst) {
      return `?${k}=${v}`;
    } else {
      return res + `&${k}=${v}`;
    }
  }, '');
}

// to be test
export function parse(query: string) {
  return query.split('&').reduce((res, part) => {
    let [key, value] = part.split('=');
    res[key] = value;
    return res;
  }, {});
}
