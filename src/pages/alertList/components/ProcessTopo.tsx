import Cechart from "@/components/echart/Cechart";
import { computed, defineComponent, ref } from "vue";

const AsSankey = defineComponent(() => {
  const aa = ref(0);

  const option = computed(() => ({
    series: {
      type: "sankey",
      layout: "none",
      // emphasis: {
      //   focus: "adjacency",
      // },
      data: [
        {
          name: "4376",
        },

        {
          name: "4373",
        },
        {
          name: "2342",
        },
        {
          name: "3671",
        },
        {
          name: "5710",
        },
        {
          name: "3768",
        },
      ],
      links: [
        {
          source: "4376",
          target: "4373",
          value: 5,
        },
        {
          source: "3671",
          target: "3768",
          value: 3,
        },
        {
          source: "4373",
          target: "3768",
          value: 8,
        },
        {
          source: "4373",
          target: "3768",
          value: 3,
        },
        {
          source: "3671",
          target: "5710",
          value: 3,
        },
        {
          source: "3671",
          target: "3768",
          value: 3,
        },
        {
          source: "2342",
          target: "3768",
          value: 1,
        },
        {
          source: "3671",
          target: "3768",
          value: 2,
        },
      ],
    },
  }));

  return () => (
    <div class="h-full w-full">
      <Cechart class="h-full w-full" option={option.value} autoresize />
    </div>
  );
});

export default AsSankey;
