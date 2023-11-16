import { Text, View, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { ValidationErrors } from 'final-form';
import { Field, Form } from 'react-final-form';
import { AtInput } from 'taro-ui';

type Data = {
  phone: string;
};

interface IMyFormProps {
  initialValues?: Data;
  onSubmit: (data: Data) => void;
}

function MyForm({ onSubmit, initialValues }: IMyFormProps) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={validate}
      render={({ handleSubmit, form }) => (
        <View>
          <Field name="phone" type="phone">
            {({ input, meta }) => (
              <View>
                <AtInput
                  required
                  error={meta.touched && meta.error}
                  title="手机号码"
                  placeholder="手机号码"
                  {...(input as any)}
                  onErrorClick={() => {
                    // 点击显示
                    Taro.showToast({
                      title: meta.error,
                      icon: 'none',
                    });
                  }}
                />
                {/* 下方显示 */}
                {meta.touched && meta.error && <Text>{meta.error}</Text>}
              </View>
            )}
          </Field>
          <Button onClick={handleSubmit}>提交</Button>
          <Button onClick={() => form.reset()}>重置</Button>
        </View>
      )}
    />
  );
}

/** 校验 */
function validate(values: Data): ValidationErrors | Promise<ValidationErrors> {
  const errors: Partial<Record<keyof Data, any>> = {};
  if (!values.phone) {
    errors.phone = '手机号码为必填项';
  }
  return errors;
}

export default MyForm;
