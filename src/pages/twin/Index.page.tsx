import { useAlertList } from "@/store";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

const Twin = defineComponent(() => {
  const iframeRef = ref<HTMLIFrameElement | null>(null);
  const alertList = useAlertList();

  // 监听来自 iframe 的消息
  const handleMessage = (event: MessageEvent) => {
    console.log("收到来自 iframe 的消息:", event.data.data);

    // const type = event.data?.data === "middle_attack" ? "中间人劫持" : "前缀劫持";
    alertList.addAlert({
      desc: `国家生物信息中心科研用户遭遇${event.data.data}，访问NCBI受阻`,
      time: new Date().valueOf(),
    });
  };

  // 向 iframe 发送消息的方法
  const sendMessageToIframe = (message: any) => {
    if (iframeRef.value?.contentWindow) {
      iframeRef.value.contentWindow.postMessage(message, "http://192.168.200.80:8080");
    }
  };

  onMounted(() => {
    // 添加消息监听器
    window.addEventListener("message", handleMessage);
  });

  onUnmounted(() => {
    // 移除消息监听器
    window.removeEventListener("message", handleMessage);
  });

  return () => (
    <div class="h-full w-full">
      <iframe
        ref={iframeRef}
        class="h-full w-full border-none"
        // src={`http://192.168.200.80:8080?topo=emulator`}
        src={`http://localhost:8080?topo=emulator`}
      ></iframe>
    </div>
  );
});

export default Twin;
