import { AutoComplete, AutoCompleteProps } from "ant-design-vue";
import { defineComponent, ref, watchEffect } from "vue";
import { debounce } from "lodash-es";

export const DeAutoComplete = defineComponent<AutoCompleteProps>(
  ({ value, ...props }, { emit }) => {
    delete props["onUpdate:value"];
    const data = ref(value);
    // watchEffect(() => {
    //   data.value = value;
    // });
    const changeData = debounce((val) => {
      emit("update:value", val);
    }, 600);

    watchEffect(() => {
      changeData(data.value);
    });

    return () => <AutoComplete {...props} value={value} v-model:value={data.value} />;
  },
  { props: AutoComplete.props },
);
