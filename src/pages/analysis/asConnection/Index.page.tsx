import { themeType } from "@/utils/theme";
import { defineComponent } from "vue";

const AsConnection = defineComponent(() => {
  return () => (
    <div class="h-full w-full">
      <iframe
        class="h-full w-full"
        src={`${location.protocol}//${location.hostname}:8080/asconnection/?theme=${themeType}`}
      ></iframe>
    </div>
  );
});

export default AsConnection;
