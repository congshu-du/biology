import { defineComponent } from "vue";
import BgpPage from "../asOverview/Bgp.page";

const Bgp = defineComponent(() => {
  return () => (
    <div class="h-full p-4">
      <BgpPage value={7497} />
    </div>
  );
});
export default Bgp;
