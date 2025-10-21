import { Input, InputProps } from "ant-design-vue";
import { defineComponent, ref, toRef, watchEffect } from "vue";
import { debounce } from "lodash-es";

export const DeInput = defineComponent<InputProps>(
  (props, { emit }) => {
    const { "onUpdate:value": onUpdateValue, ...restProps } = props;

    const value = toRef(props, "value");
    const data = ref(value.value);

    watchEffect(() => {
      data.value = value.value;
    });

    const changeData = debounce((val) => {
      emit("update:value", val);
    }, 600);

    watchEffect(() => {
      changeData(data.value);
    });

    return () => <Input {...restProps} v-model:value={data.value} />;
  },
  { props: Input.props },
);
