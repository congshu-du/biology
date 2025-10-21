import { defineComponent, nextTick, ref, watchEffect } from "vue";

const RouteData = defineComponent(() => {
  const keyRef = ref("");

  watchEffect((onCleanup) => {
    const fun = () => {
      keyRef.value = keyRef.value + "1";
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
        src={`${location.protocol}//${location.hostname}:8099/asrelation`}
      ></iframe>
    </div>
  );
});

export default RouteData;
