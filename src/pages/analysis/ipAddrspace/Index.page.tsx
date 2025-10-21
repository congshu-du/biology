import { themeType } from "@/utils/theme";
import { defineComponent, watchEffect } from "vue";

const Ipaddrspace = defineComponent(() => {
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
    <div class="h-full w-full">
      <iframe
        class="h-full w-full"
        src={`${location.protocol}//${location.hostname}:8080/ipaddrspace/?theme=${themeType}`}
      ></iframe>
    </div>
  );
});

export default Ipaddrspace;
