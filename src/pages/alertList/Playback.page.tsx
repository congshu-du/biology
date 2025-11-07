import { defineComponent, nextTick, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

const Playback = defineComponent(() => {
  const route = useRoute();
  const keyRef = ref("");

  watchEffect((onCleanup) => {
    const fun = () => {
      keyRef.value = Math.random() + "";
    };
    nextTick(() => {
      document.addEventListener("fullscreenchange", fun);
    });

    onCleanup(() => {
      document.removeEventListener("fullscreenchange", fun);
    });
  });

  return () => (
    <div class="h-full w-full">
      <iframe
        key={keyRef.value}
        class="h-full w-full border-none"
        src={`${location.protocol}//${location.hostname}:8089?eventId=${route.query.eventId}`}
      ></iframe>
    </div>
  );
});

export default Playback;
