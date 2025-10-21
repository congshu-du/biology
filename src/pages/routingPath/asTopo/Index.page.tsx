import { defineComponent, ref, watchEffect } from "vue";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";
import { css } from "@emotion/css";
import { Input, theme } from "ant-design-vue";

const AsTopo = defineComponent(() => {
  const constainer = ref<HTMLDivElement>();
  const { token } = theme.useToken();

  const shadow = css`
    box-shadow: ${token.value.boxShadowSecondary};
  `;
  watchEffect(() => {
    const graph = new Graph();
    graph.addNode("1", { label: "124.16.0.0/15", size: 18, color: token.value.red });
    graph.addNode("2", { label: "7494", labelColor: "blue", size: 18, color: token.value.red });
    Array(16)
      .fill(1)
      .forEach((_n, i) => {
        graph.addNode(`${i + 3}`, { label: `679${i + 3}`, size: 16, color: token.value.colorBorder });
      });

    graph.addEdge("1", "2", { size: 10 });
    graph.addEdge("2", "3", { size: 2 });
    graph.addEdge("3", "4", { size: 2 });
    graph.addEdge("3", "5", { size: 2 });
    graph.addEdge("3", "6", { size: 2 });
    graph.addEdge("3", "7", { size: 2 });
    graph.addEdge("3", "8", { size: 2 });
    graph.addEdge("4", "9", { size: 2 });
    graph.addEdge("4", "10", { size: 2 });
    graph.addEdge("5", "11", { size: 2 });
    graph.addEdge("5", "12", { size: 2 });
    graph.addEdge("6", "13", { size: 2 });
    graph.addEdge("6", "14", { size: 2 });
    graph.addEdge("7", "15", { size: 2 });
    graph.addEdge("7", "16", { size: 2 });
    graph.addEdge("8", "17", { size: 2 });
    graph.addEdge("8", "18", { size: 2 });

    graph.nodes().forEach((node, i) => {
      const angle = (i * 2 * Math.PI) / graph.order;
      graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
      graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
    });

    if (constainer.value) {
      const sigmaInstance = new Sigma(graph, constainer.value, { labelColor: { color: token.value.colorText } });
      // bindWebGLLayer(
      //   "metaballs",
      //   sigmaInstance,
      //   createContoursProgram(graph.nodes(), {
      //     radius: 150,
      //     feather: 1,
      //     border: {
      //       color: "#000000",
      //       thickness: 4,
      //     },
      //     levels: [
      //       {
      //         color: "#fff7f3",
      //         threshold: 0.9,
      //       },
      //       {
      //         color: "#fde0dd",
      //         threshold: 0.8,
      //       },
      //       {
      //         color: "#fcc5c0",
      //         threshold: 0.7,
      //       },
      //       {
      //         color: "#fa9fb5",
      //         threshold: 0.6,
      //       },
      //       {
      //         color: "#f768a1",
      //         threshold: 0.5,
      //       },
      //       {
      //         color: "#dd3497",
      //         threshold: 0.4,
      //       },
      //       {
      //         color: "#ae017e",
      //         threshold: 0.3,
      //       },
      //       {
      //         color: "#7a0177",
      //         threshold: 0.2,
      //       },
      //       {
      //         color: "#49006a",
      //         threshold: -0.1,
      //       },
      //     ],
      //   }),
      // );

      const camera = sigmaInstance.getCamera();

      camera.setState({
        ratio: 1.4,
      });

      const layout = new ForceSupervisor(graph);
      layout.start();

      setTimeout(() => {
        layout.kill();
      }, 3000);

      sigmaInstance.on("clickNode", (nodeId) => {
        // console.log(nodeId, 55555);
      });
    }
  });
  return () => (
    <div class="flex flex-col h-full">
      <div class="p-4 pb-0">
        <Input placeholder="请输入路由前缀" class="w-60" />
        <span class="ml-4" style={{ color: token.value.colorTextDescription }}>
          输入一个ip地址，查询出与其相关的所有AS
        </span>
      </div>
      <div class="flex-1 p-4 ">
        <div class={`h-full rounded-lg ${shadow}`} ref={constainer}></div>
      </div>
    </div>
  );
});

export default AsTopo;
