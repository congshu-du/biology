import { RouterView } from "vue-router";
import { defineComponent, nextTick, ref, watchEffect } from "vue";
import { token } from "@/utils/theme";
import Header from "./Header";
import { useFullScreen } from "@/store";

export default defineComponent(() => {
  const fullScreen = useFullScreen();
  const content = ref<HTMLDivElement | null>(null);

  watchEffect(() => {
    nextTick(() => {
      document.addEventListener("fullscreenchange", () => {
        fullScreen.full = document.fullscreenElement !== null;
      });
    });
  });

  watchEffect(() => {
    if (content.value) {
      if (fullScreen.full && !document.fullscreenElement) {
        content.value.requestFullscreen();
      } else if (!fullScreen.full && document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  });

  return () => (
    <div ref={content} class="h-full">
      <a-layout
        style={{
          background: token.B1,
          color: token.colorText,
          fontFamily: "HYQiHei55J",
        }}
        class="h-full overflow-y-auto"
      >
        {!fullScreen.full && <Header />}
        <a-layout-content style={{ marginTop: fullScreen.full ? 0 : "64px" }}>
          <RouterView />
        </a-layout-content>
      </a-layout>
    </div>
  );
});
