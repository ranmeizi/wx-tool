import IMG_HRL from '@/assets/images/hrl.png';
import Menu from '@/components/Menu';
import { useModal } from '@/components/Modal';
import Page from '@/components/Page';
import SafeArea from '@/components/SafeArea';
import axios from '@/utils/requests/cloudrun-rust';
import { Button, Image, Input, ScrollView, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { AtIcon } from 'taro-ui';
import './normal-calc.less';
import { normalCDF } from './utils';

/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'normal-calc';

type PetInfoDto = {
  name: string;
  growth_sum: [number, number];
  growth_hp: [number, number];
  growth_atk: [number, number];
  growth_def: [number, number];
  growth_agi: [number, number];
  growth_sum_ex: [number, number];
  growth_hp_ex: [number, number];
  growth_atk_ex: [number, number];
  growth_def_ex: [number, number];
  growth_agi_ex: [number, number];
};

definePageConfig({
  navigationBarTitleText: '概率计算器',
});

const INITIAL_VALUES = {
  expect: undefined,
  hp: [0.94, 1.568],
  atk: [1.199, 1.999],
  def: [0.25, 0.417],
  agi: [0.702, 1.17],
};

export default function () {
  const [probability, setProbability] = useState<number>();
  const [price, setPrice] = useState<number>();
  const [cost, setCost] = useState<number>();
  const [modalCtrl, modal] = useModal();
  const formRef = useRef<any>();

  function onSubmit({ expect, ...growths }) {
    // 计算总成长
    let grMin = 0;
    let grMax = 0;
    let a = 0;

    for (let [min, max] of Object.values(growths)) {
      grMin += min;
      grMax += max;
      const average = (min + max) / 2;
      a += Math.pow(max - average, 2);
    }

    const res = normalCDF((grMax + grMin) / 2, a, expect);

    setProbability(1 - res);
  }

  const required = (title) => (value) =>
    value ? undefined : `${title} 不能为空`;

  function onError(errors: Record<string, string>) {
    const msgs = Object.values(errors);
    Taro.vibrateLong({});
    Taro.showToast({
      title: msgs[0],
      icon: 'none',
    });
  }

  function calcCost() {
    setCost(Math.round((1 / probability!) * price!));
  }

  async function upload() {
    const res = await Taro.chooseMedia({
      count: 1,
      mediaType: ['image'],
    });

    let path = res.tempFiles[0].tempFilePath;

    let filename = path.split('/').pop();
    Taro.showLoading({ title: '请稍后...' });
    try {
      // const filename = ''
      const { fileID } = await Taro.cloud.uploadFile({
        cloudPath: `ocr-img/${filename}`,
        filePath: path,
      });

      await axios.post('/ocr/sqsd/oss', { fileid: fileID }).then((res) => {
        Taro.showToast({
          title: '识别成功',
          icon: 'none',
        });

        changeForm(res.data.data);
      });
    } catch (e) {
      Taro.showToast({
        title: '识别失败！',
        icon: 'none',
      });
    } finally {
      Taro.hideLoading();
    }
  }

  function changeForm(data: PetInfoDto) {
    // 设置 form 表单
    const hp_state = formRef.current.getFieldState('hp');
    const atk_state = formRef.current.getFieldState('atk');
    const def_state = formRef.current.getFieldState('def');
    const agi_state = formRef.current.getFieldState('agi');

    hp_state.change(data.growth_hp.map(Number));
    atk_state.change(data.growth_atk.map(Number));
    def_state.change(data.growth_def.map(Number));
    agi_state.change(data.growth_agi.map(Number));
  }

  function onTip() {
    modalCtrl.current?.info({
      header: '提示',
      content: (
        <View style={{ fontSize: '24rpx' }}>
          <View>使用正态分布公式，依据成长计算概率</View>
          <View>帮助您快速预估一直期望成长的宠物成本</View>
          <View>1.请输入宠物的《成长率》和《期望成长》</View>
          <View>2.点击《计算概率》按钮</View>
          <View>3.输入单价</View>
          <View>&nbsp;&nbsp;例如重生果实 1000金 / 只</View>
          <View>&nbsp;&nbsp;宠物饲料 990 / 10 只</View>
          <View>
            &nbsp;&nbsp;（宠物饲料，视情况取平均数，由您30分钟抓宠数量而定）
          </View>
          <View>4.点击计算成本</View>
        </View>
      ),
    });
  }

  function onOcrTip() {
    modalCtrl.current?.info({
      header: '提示',
      content: (
        <View style={{ fontSize: '24rpx' }}>
          <View>识别《宠物图鉴》中宠物的成长</View>
          <Image
            src={IMG_HRL}
            mode="widthFix"
            className="full-width"
            style={{ margin: '16rpx 0' }}
          ></Image>
          <View>请打开游戏《图鉴》中找到对应宠物截图</View>
        </View>
      ),
    });
  }

  return (
    <Page pageId={PAGE_ID} className="normal-calc-root">
      <Form
        onSubmit={onSubmit}
        initialValues={INITIAL_VALUES}
        render={({ handleSubmit, form, errors }) => {
          formRef.current = form;
          return (
            <View className="f-c full-height">
              <ScrollView className="normal-calc-view full-height full-width">
                {modal}
                <View
                  className="title f-r j-between a-center full-width"
                  style={{ marginBottom: '24rpx' }}
                >
                  <View> 计算结果</View>
                  <Button
                    className="tip-btn f-r j-center a-center"
                    onClick={onTip}
                  >
                    ?
                  </Button>
                </View>
                <Menu className="info">
                  <Menu.Item>
                    <View>
                      概率：
                      {probability
                        ? `${probability?.toFixed(8)} | ${(
                            probability * 10000
                          ).toFixed(0)} / 万次`
                        : '--'}
                    </View>
                    <View>
                      花费：
                      {cost ? `${cost} 金币` : '--'}
                    </View>
                  </Menu.Item>
                </Menu>
                <View
                  className="title f-r j-between a-center"
                  style={{ marginBottom: '24rpx' }}
                >
                  <View>宠物成长数据</View>
                  <View className="f-r a-center">
                    <Button className="ocr-btn" onClick={upload}>
                      图像识别 <AtIcon value="image" size={12} />
                    </Button>
                    <Button
                      className="tip-btn f-r j-center a-center"
                      onClick={onOcrTip}
                    >
                      ?
                    </Button>
                  </View>
                </View>
                <Menu>
                  <Menu.Item>
                    <View className="full-width f-r j-between">
                      <Field name="expect" validate={required('期望成长')}>
                        {({ input, meta }) => (
                          <SingleInput
                            label="期望成长"
                            {...input}
                            error={meta.touched && meta.error}
                          />
                        )}
                      </Field>
                      <SingleInput
                        label="单只花费"
                        value={price || ''}
                        onChange={setPrice}
                        {...({} as any)}
                      />
                    </View>
                  </Menu.Item>
                  <Menu.Item>
                    <Field name="hp">
                      {({ input, meta }) => (
                        <InputRange
                          label="生命成长"
                          {...input}
                          error={meta.touched && meta.error}
                        />
                      )}
                    </Field>
                  </Menu.Item>
                  <Menu.Item>
                    <Field name="atk">
                      {({ input, meta }) => (
                        <InputRange
                          label="攻击成长"
                          {...input}
                          error={meta.touched && meta.error}
                        />
                      )}
                    </Field>
                  </Menu.Item>
                  <Menu.Item>
                    <Field name="def">
                      {({ input, meta }) => (
                        <InputRange
                          label="防御成长"
                          {...input}
                          error={meta.touched && meta.error}
                        />
                      )}
                    </Field>
                  </Menu.Item>
                  <Menu.Item>
                    <Field name="agi">
                      {({ input, meta }) => (
                        <InputRange
                          label="敏捷成长"
                          {...input}
                          error={meta.touched && meta.error}
                        />
                      )}
                    </Field>
                  </Menu.Item>
                </Menu>
              </ScrollView>
              <View className="float-view">
                <View className="f-r">
                  <Button
                    className="btn primary"
                    onClick={
                      errors && Object.keys(errors).length > 0
                        ? (e) => {
                            onError(errors);
                            handleSubmit(e);
                          }
                        : handleSubmit
                    }
                  >
                    计算概率
                  </Button>
                  <Button
                    className={`btn primary ${
                      probability === undefined || price === undefined
                        ? 'disabled'
                        : ''
                    }`}
                    onClick={calcCost}
                    disabled={probability === undefined || price === undefined}
                  >
                    计算成本
                  </Button>
                  <Button
                    className="btn ghost"
                    onClick={() => {
                      form.reset();
                      setPrice(undefined);
                      setCost(undefined);
                    }}
                  >
                    重置
                  </Button>
                </View>

                <SafeArea position="bottom"></SafeArea>
              </View>
            </View>
          );
        }}
      />
    </Page>
  );
}

type InputRangeProps = {
  label: string;
};
function InputRange({
  label,
  value,
  onChange,
  error,
  ...inputProps
}: InputRangeProps & FieldInputProps<[number, number]>) {
  function onMinChange(e) {
    onChange([Number(e.detail.value), value[1]]);
  }
  function onMaxChange(e) {
    onChange([value[0], Number(e.detail.value)]);
  }
  return (
    <View className={`range-input f-r a-center ${error ? 'error' : ''}`}>
      <View
        className="tt-title"
        style={{ marginRight: '24rpx', minWidth: 'max-content' }}
      >
        {label}:
      </View>
      <View className="f-r a-center j-between full-width">
        <Input
          {...inputProps}
          type="digit"
          className="tt-input"
          value={String(value[0])}
          onInput={onMinChange}
        ></Input>
        <View>~</View>
        <Input
          {...inputProps}
          className="tt-input"
          type="digit"
          value={String(value[1])}
          onInput={onMaxChange}
        ></Input>
      </View>
    </View>
  );
}

function SingleInput({
  label,
  value,
  onChange,
  error,
  ...inputProps
}: InputRangeProps & FieldInputProps<number | undefined>) {
  function onMinChange(e) {
    onChange(e.detail.value);
  }
  console.log(error);
  return (
    <View className={`range-input f-r a-center ${error ? 'error' : ''}`}>
      <View
        className="tt-title"
        style={{ marginRight: '24rpx', minWidth: 'max-content' }}
      >
        {label}:
      </View>
      <Input
        {...inputProps}
        className="tt-input"
        type="digit"
        value={String(value)}
        onInput={onMinChange}
      ></Input>
    </View>
  );
}
