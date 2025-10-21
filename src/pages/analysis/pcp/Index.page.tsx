import { themeType, token } from "@/utils/theme";
import { defineComponent, watchEffect } from "vue";

const Pcp = defineComponent(() => {
  watchEffect((onCleanup) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "customEvent") {
        console.log(event.data);
      }
    };
    window.addEventListener("message", handleMessage, false);
    onCleanup(() => {
      window.removeEventListener("message", handleMessage, false);
    });
  });

  return () => (
    <div style={{ background: token.B2 }} class="h-full w-full">
      <iframe
        class="h-full w-full"
        src={`${location.protocol}//${location.hostname}:8080/pcp/?theme=${themeType}`}
      ></iframe>
    </div>
  );
});

export default Pcp;
