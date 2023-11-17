import Menu from '@/components/Menu';
import Page from '@/components/Page';
import SafeArea from '@/components/SafeArea';
import { Button, Input, ScrollView, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { Field, Form } from 'react-final-form';
import './normal-calc.less';
import { normalCDF } from './utils';
/** 用于埋点的 pageId (必须) */
const PAGE_ID = 'normal-calc';

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
  const [cost, setCost] = useState<[number, number]>();

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
    const optimisticTimes = Math.floor(1 / probability!);
    const pessimisticTimes = Math.ceil(1 / probability!);

    setCost([
      Math.round(optimisticTimes * price!),
      Math.round(pessimisticTimes * price!),
    ]);
  }

  console.log('price', price);

  return (
    <Page pageId={PAGE_ID} className="normal-calc-root">
      <Form
        onSubmit={onSubmit}
        initialValues={INITIAL_VALUES}
        render={({ handleSubmit, form, errors }) => (
          <View className="f-c full-height">
            <ScrollView className="normal-calc-view full-height full-width">
              <View></View>
              <View className="title" style={{ marginBottom: '24rpx' }}>
                计算结果
              </View>
              <Menu className="info">
                <Menu.Item>
                  <View>使用正态分布公式，依据成长计算概率</View>
                  <View>使用概率/单价预估花费。</View>
                </Menu.Item>
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
                    {cost
                      ? `乐观：${cost[0]} 金币，悲观：${cost[1]} 金币`
                      : '--'}
                  </View>
                </Menu.Item>
              </Menu>
              <View className="title" style={{ marginBottom: '24rpx' }}>
                宠物成长数据
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
        )}
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
    onChange([e.detail.value, value[1]]);
  }
  function onMaxChange(e) {
    onChange([value[0], e.detail.value]);
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
