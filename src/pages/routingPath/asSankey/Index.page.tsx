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
          name: "a",
        },

        {
          name: "b",
        },
        {
          name: "a1",
        },
        {
          name: "a2",
        },
        {
          name: "b1",
        },
        {
          name: "c",
        },
      ],
      links: [
        {
          source: "a",
          target: "a1",
          value: 5,
        },
        {
          source: "a",
          target: "a2",
          value: 3,
        },
        {
          source: "b",
          target: "b1",
          value: 8,
        },
        {
          source: "a",
          target: "b1",
          value: 3,
        },
        {
          source: "b1",
          target: "a1",
          value: 1,
        },
        {
          source: "b1",
          target: "c",
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
