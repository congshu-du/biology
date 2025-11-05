import { defineComponent } from "vue";

const Twin = defineComponent(() => {
  return () => (
    <div class="h-full w-full">
      <iframe class="h-full w-full border-none" src={`http://192.168.200.80:8080?topo=emulator`}></iframe>
    </div>
  );
});

export default Twin;
